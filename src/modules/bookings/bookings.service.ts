import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { userCheckService } from '../users/user.check';
import { AppService } from '../../app.service'
import { BookUnits } from '../../dtos/unit.dto'

@Injectable()
export class BookingsService {
    constructor(
        @InjectDataSource('database')
        private readonly Datasource: DataSource,

        @Inject(AppService)
        private service: AppService,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,
    ) { }
    async bookUnit(data: BookUnits) {

        //Checking User Authentication
        let user = await this.userCheck.checkById(data.user_id);
        if (user == 'user not found') {
            return this.service.sendResponse(401, 'Unauthorized user');
        }
        //? Check if the unit is booked or not
        let check=await this.Datasource.manager.query(`
            select count(id) as total from bookings where unit_id = $1 and tenant=$2 and is_active = true
            `,[data.unit_id,data.tenant]);
        if(check[0].total>0){
            return await this.service.sendResponse(401, 'Unable to Book this Unit')
        }
        let res,flag=true;
        //? adding lod in booking table
        try {
            if (data.duration != null) {
                res = await this.Datasource.manager.query(`     
                insert into bookings
                (
                    bookingdate,
                    remarks,
                    create_at,
                    customer,
                    duration,
                    email,
                    budget,
                    area,
                    category,
                    tenant,
                    is_active,
                    user_id,
                    unit_id
                )
                values(
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
                )
            `, [
                    data.bookingDate,//1
                    data.remarks,//2
                    data.created_at,//3
                    data.customer,//4
                    data.duration,//5
                    data.email,//6
                    data.budget,//7
                    data.area,//8
                    data.category,//9
                    data.tenant,//10
                    data.is_Active,//11
                    data.user_id,//12
                    data.unit_id,//13
                ]);
            }
            else {
                res = await this.Datasource.manager.query(`     
                    insert into bookings
                    (
                        bookingdate,
                        remarks,
                        create_at,
                        customer,
                        email,
                        budget,
                        area,
                        category,
                        tenant,
                        is_active,
                        user_id,
                        unit_id
                    )
                    values(
                        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
                    )
                `, [
                    data.bookingDate,//1
                    data.remarks,//2
                    data.created_at,//3
                    data.customer,//4
                    data.email,//5
                    data.budget,//6
                    data.area,//7
                    data.category,//8
                    data.tenant,//9
                    data.is_Active,//10
                    data.user_id,//11
                    data.unit_id,//12
                ]);
            }
        } catch (error) {
            flag=false;
        }

        //? upda
        try {
            let unit= await this.Datasource.manager.query(`
                    update units
                    set isactive = false
                    where id = $1
                    and tenant=$2
                `,[data.unit_id,data.tenant]);
        } catch (error) {
            flag=false
        }
        if(flag){return await this.service.sendResponse(201, 'Unit Booked Successfully')}
        else{return await this.service.sendResponse(201, 'Unit Booked Successfully')}
    }
    async viewAllBookingAdmin(user_id:any,teant:any){
        let user= await this.userCheck.checkById(user_id);
        if(user!='Super Admin'){
            return this.service.sendResponse(401,'Unauthorized user');
        }
        let data = await this.Datasource.manager.query(`
                select * from bookings where tenant = $1
            `
        ,[teant]);
        if(data.length==0){
            return this.service.sendResponse(412,'No data to Show');
        }
        return data;
    }
    async viewBooking(user_id:any,teant:any){
        let user= await this.userCheck.checkById(user_id);
        if(!user){
            return this.service.sendResponse(401,'Unauthorized user');
        }
        let data = await this.Datasource.manager.query(
            `select * from bookings 
            where tenant = $1
            and user_id =$2`
        ,[teant,user_id]);
        if(data.length==0){
            return this.service.sendResponse(412,'No data to Show');
        }
        return data;        
    }
    async viewaBooking(unit_id:number,user_id:any,teant:any){
        let user= await this.userCheck.checkById(user_id);
        if(!user){
            return this.service.sendResponse(401,'Unauthorized user');
        }
        let data = await this.Datasource.manager.query(
            `select * from bookings 
            where tenant = $1
            and user_id =$2
            and unit_id =$3`
        ,[teant,user_id,unit_id]);
        if(data.length==0){
            return this.service.sendResponse(412,'No data to Show');
        }
        return data;        
    }
}

