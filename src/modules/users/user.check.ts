import { Injectable } from "@nestjs/common";
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';


@Injectable()
export class userCheckService{
    constructor(
        @InjectDataSource('database')
        private readonly userDatasource:DataSource
    ){}

    async checkUserDetails(name:string,email:string,contact:number){
        let user = await this.userDatasource.manager.query(
            `Select * from tenants
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
}