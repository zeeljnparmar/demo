import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { userCheckService } from '../users/user.check';
import {AppService} from '../../app.service'

@Injectable()
export class BookingsService {
    constructor(
        @InjectDataSource('database')
        private readonly Datasource:DataSource,

        @Inject(AppService)
        private service: AppService,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,
    ){}
    async bookUnit(unit_id,){
        
    }
}
