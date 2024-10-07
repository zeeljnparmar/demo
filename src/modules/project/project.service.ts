import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { userCheckService } from '../users/user.check';
import {AppService} from '../../app.service'

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
            where is_Active = true  
        `)
        if(data.length>0){
            return this.service.sendResponse(
                200,'Data Found',data
            )
        }
        return this.service.sendResponse(201,'No Projects Found ')
    }
    async viewAProject(project_id){
        let data = (`
            Select * from units 
            where property_id = ${project_id}
            and isactive = 'true'
        `);
        return data;
    }
    async createProject(request:any):Promise<any>{
        let user= await this.userCheck.checById(request.user_id);
        if(user!='Super Admin'){
            return this.service.sendResponse(201,'Unauthorized user');
        }
        try {
            let data = await this.Datasource.manager.query(`
                insert into property
                    (display_name,description,isactive,user_id,status,tenant)
                values(
                    $1,$2,$3,$4,$5,$6
                )
            `,[request.display_name,request.description,request.is_Active,request.user_id,request.status,request.tenant]);
        } catch (error) {
            return this.service.sendResponse(201,'Input Data Contain invalid fields or Duplicate data');
        }
        return this.service.sendResponse(201,'Project Created');
    }
    async insertUnits(){
        
    }
}
