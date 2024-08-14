import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import {userDto} from '../../dtos/user.dto'
import {userCheckService} from './user.check'

@Injectable()
export class UsersService {
    constructor(
        @InjectDataSource('database')
        private readonly userDatasource:DataSource,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,
    ){}

    async getAllUsers():Promise<any>{
        let data = await this.userDatasource.manager.query(`select * from tenants`);
        console.log(data);
        return data;
    }

    async createUser(user: userDto):Promise<any>{
        let check = await this.userCheck.checkUserDetails(user.name,user.email,user.contact);
        if (check==='error'){
            return 'user already Exists';
        }else{
            return 'To be Continue';
        }
    }
}
