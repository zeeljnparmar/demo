import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import {userDto} from '../../dtos/user.dto'
import {userCheckService} from './user.check'
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import * as res from '../../constants/constants'
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectDataSource('database')
        private readonly userDatasource:DataSource,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,

        @Inject(AppService)
        private service: AppService,

        private jwtService: JwtService
    ){}

    async getAllUsers():Promise<any>{
        let data = await this.userDatasource.manager.query(`select * from public.user`);
        return data;
    }

    async createUser(user: userDto):Promise<any>{

        //? Validating user data
        let check = await this.userCheck.checkUserDetails(user.name,user.email,user.contact,user.rera);
        if (check==='error'){
            return 'user already Exists';
        }
        try {
            let hashed = await bcrypt.hash(user.password,10);
            await this.userDatasource.manager.query(
                `insert into public.user
                (
                    name,email,contact,gender,address,rera,company,password,designation
                )
                values(
                    '${user.name}',
                    '${user.email}',
                    ${user.contact},
                    '${user.gender}',
                    '${user.address}',
                    '${user.rera}',
                    '${user.company}',
                    '${hashed}',
                    '${user.designation}'    
                )`
            )
            return {
                status:201,
                message:'User Created Successfully'
            }
        } catch (error) {
            console.log(error);
            return{
                status:200,
                message:'Unexpected Error has occured'
            }                        
        }
    }

    async getSingleUser(req:any){
        try {
            let data= await this.userDatasource.manager.query(`
                select * from public.user
                where name ~*$1 
                or email ~* $2 
                or id = $3
                or company ~* $4  
            `,[req.name,req.email,req.id,req.company])
            if(data.length==0){
                return{
                    status:200,
                    message:"Data Not found"
                }
            }
            return {
                status:200,
                data:data,
                message:"User found"
            }
        } catch (error) {
            return {
                status:201,
                message:error
                
            }
        }
    }

    async login(req:any){
        if(!req.password){
            return 'NO Password Error'
        }
        let data= await this.userDatasource.manager.query(`
            select password,isapproved,id,name,rera,designation,tenant from public.user
            where name = $1 
            or email =  $2 
            or contact = $3
        `,[req.name,req.email,req.number])
        if(data.length===0){
            return this.service.sendResponse(400,'user Not found')
        }
        if( await bcrypt.compare(req.password,data[0].password) && data[0].isapproved===true){
            delete data[0].password;
            delete data[0].isapproved;
            return this.service.sendResponse(201,res.success,await this.jwtService.signAsync(data[0],{secret:res.jwt}))
        }
        return this.service.sendResponse(401,res.Unauthorized)
    }
}
