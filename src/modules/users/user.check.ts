import { Injectable } from "@nestjs/common";
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';


@Injectable()
export class userCheckService{
    constructor(
        @InjectDataSource('database')
        private readonly userDatasource:DataSource
    ){}

    async checkUserDetails(name:string,email:string,contact:number,rera:string){
        let user = await this.userDatasource.manager.query(
            `Select * from public.user
            where name = $1
            or email =$2
            or contact = $3`,
            [name,email,contact]
        )
        if(user.length>0){
            return 'error'
        }
        return 'success'
    }
    async checkById(id:number){
        let user = await this.userDatasource.manager.query(`
                select designation from public.user where id=$1  
        `,[id]);
        if(user.length>0){
            return user[0].designation;
        }
        return 'user not found';
    }
}