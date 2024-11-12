import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { userCheckService } from '../users/user.check';
import {AppService} from '../../app.service'
import { insertunit } from 'src/dtos/project.dto';
import * as res from 'src/constants/constants';

@Injectable()
export class ProjectService {
    constructor(
        @InjectDataSource('database')
        private readonly Datasource:DataSource,

        @Inject(AppService)
        private service: AppService,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,
    ){}

    async viewAllProject(){
        let data = await this.Datasource.manager.query(`
            select * from property
            where isactive = true  
        `)
        if(data.length>0){
            return this.service.sendResponse(
                200,res.success,data
            )
        }
        return this.service.sendResponse(201,res.notFound)
    }
    async viewAProject(project_id){
        try {
            let data = await this.Datasource.manager.query(`
                Select * from units 
                where property_id = ${project_id}
                and isactive = 'true'
            `);
            return await this.service.sendResponse(200,res.success,data);
        } catch (error) {
            return await this.service.sendResponse(500,res.unexpexted);
        }
    }
    async createProject(request:any):Promise<any>{
        let user= await this.userCheck.checById(request.user_id);
        if(user!='Super Admin' || user!='Admin'){
            return this.service.sendResponse(401,'Unauthorized user');
        }
        try {
            let data = await this.Datasource.manager.query(`
                insert into property
                    (display_name,description,isactive,user_id,status,tenant)
                values(
                    $1,$2,$3,$4,$5,$6
                )
            `,[request.display_name,request.description,request.is_Active,request.user_id,request.status,request.tenant]);
            return await this.service.sendResponse(200,res.success);
        } catch (error) {
            return this.service.sendResponse(201,res.unexpexted);
        }
    }
    async insertUnits(data:insertunit){
        let user= await this.userCheck.checById(data.user_id);
        if(user==='Super Admin'||user==='Admin'){
            try {
                for(let i=0;i<data.units.length;i++){
                    let res=await this.Datasource.manager.query(`     
                        insert into units
                        (
                            type,
                            block,
                            floor,
                            unit_no,
                            unit_size,
                            isactive,
                            user_id,
                            property_id,
                            status,
                            tenant
                        )
                        values(
                            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
                        )
                    `,[
                        data.units[i].type,
                        data.units[i].block,
                        data.units[i].floor,
                        data.units[i].unit_no,
                        data.units[i].unit_size,
                        data.units[i].isactive,
                        data.user_id,
                        data.property_id,
                        data.units[i].status,
                        data.tenant,
                    ]);
                }
                return await this.service.sendResponse(201,'Unites Created Succefully')  
            } catch (error) {
                return await this.service.sendResponse(201,res.unexpexted);
            }
        }else{
            return await this.service.sendResponse(401,res.Unauthorized)
        }
    }   
    async deleteUnit(id:number,user_id:number){
        let user= await this.userCheck.checById(user_id);
        if(user==='Super Admin' || user==='Admin'){
            try{
                let data = await this.Datasource.manager.query(`
                    delete from units 
                    where id = $1    
                `,[id])
                return await this.service.sendResponse(201,res.success);
            }catch(err){
                return await this.service.sendResponse(500,res.unexpexted);
            }
        }else{
            return this.service.sendResponse(401,'Unauthorized user');
        }
    }
    async updateUnit(req:{user_id,id,tenant,status,isactive}){
        let user= await this.userCheck.checById(req.user_id);
        if(!req.id){return await this.service.sendResponse(400,res.unexpexted)}
        if(user==='Super Admin' || user==='Admin'){
            try {
                let str='set '
                if(req.status){str+=`status = ${req.status}`}
                if(req.isactive){str+=`isactive = ${req.isactive}`}
                let res = await this.Datasource.manager.query(`
                    update units
                    ${str}
                    where id = ${req.user_id}
                    and tenant = ${req.tenant}
                `)
                return await this.service.sendResponse(201,res.success)
            } catch (error) {
                return await this.service.sendResponse(500,res.unexpexted)
            }
        }else{
            return await this.service.sendResponse(401,res.Unauthorized)
        }
    }
}
