import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { userCheckService } from '../users/user.check';
import { AppService } from '../../app.service'
import { insertunit } from 'src/dtos/project.dto';
import * as res from 'src/constants/constants';

@Injectable()
export class ProjectService {
    constructor(
        @InjectDataSource('database')
        private readonly Datasource: DataSource,

        @Inject(AppService)
        private service: AppService,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,
    ) { }

    async viewAllProject() {
        let data = await this.Datasource.manager.query(`
            select * from property
            where isactive = true  
        `)
        if (data.length > 0) {
            return this.service.sendResponse(
                200, res.success, data
            )
        }
        return this.service.sendResponse(201, res.notFound)
    }
    async viewAProject(req) {
        await this.updateWhileRender(req.tenant);
        try {
            let data = await this.Datasource.manager.query(`
                Select * from units 
                where property_id = ${req.id}
                and isactive = 'true'
            `);
            return await this.service.sendResponse(200, res.success, data);
        } catch (error) {
            return await this.service.sendResponse(500, res.unexpexted);
        }
    }
    async createProject(request: any): Promise<any> {
        let user = await this.userCheck.checkById(request.user_id);
        console.log(user != 'Super Admin');
        if (user === 'Super Admin' || user === 'Admin') {
            try {
                let data = await this.Datasource.manager.query(`
                insert into property
                    (display_name,description,isactive,user_id,status,tenant)
                values(
                    $1,$2,$3,$4,$5,$6
                )
            `, [request.display_name, request.description, request.is_Active, request.user_id, request.status, request.tenant]);
                return await this.service.sendResponse(200, res.success);
            } catch (error) {
                return this.service.sendResponse(201, res.exists);
            }
        }
        return this.service.sendResponse(400, res.Unauthorized)
    }
    async insertUnits(data: insertunit) {
        let user = await this.userCheck.checkById(data.user_id);
        if (user === 'Super Admin' || user === 'Admin') {
            try {
                for (let i = 0; i < data.units.length; i++) {
                    let res = await this.Datasource.manager.query(`     
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
                    `, [
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
                return await this.service.sendResponse(201, 'Unites Created Succefully')
            } catch (error) {
                return await this.service.sendResponse(201, res.exists);
            }
        } else {
            return await this.service.sendResponse(401, res.Unauthorized)
        }
    }
    async deleteUnit(id: number, user_id: number) {
        let user = await this.userCheck.checkById(user_id);
        if (user === 'Super Admin' || user === 'Admin') {
            try {
                let data = await this.Datasource.manager.query(`
                    delete from units 
                    where id = $1    
                `, [id])
                return await this.service.sendResponse(201, res.success);
            } catch (err) {
                return await this.service.sendResponse(500, res.unexpexted);
            }
        } else {
            return this.service.sendResponse(401, 'Unauthorized user');
        }
    }
    async updateUnit(req: { user_id, id: number, tenant, isactive, status?: string }) {
        let user = await this.userCheck.checkById(req.user_id);
        console.log(req);
        if (!req.id) { return await this.service.sendResponse(400, res.unexpexted) }
        if (user === 'Super Admin' || user === 'Admin') {
            try {
                let str = 'set '
                if (req.status) { str += `status = ${req.status}` }
                if (req.isactive) { str += `isactive = ${req.isactive}` }
                console.log(str)
                let res = await this.Datasource.manager.query(`
                    update units
                    ${str}
                    where id = ${req.id}
                    and user_id = ${req.user_id}
                    and tenant = '${req.tenant}'
                `)
                return await this.service.sendResponse(201, res.success)
            } catch (error) {
                return await this.service.sendResponse(500, res.unexpexted)
            }
        } else {
            return await this.service.sendResponse(401, res.Unauthorized)
        }
    }
    async updateWhileRender(tenant) {
        //? Check unit for update
        const d = new Date();
        let units = await this.Datasource.manager.query(
            `select unit_id,create_at 
                    from bookings 
                    where tenant =$1`,
            [tenant]
        )
        if (units) {
            const current = new Date(d).getTime();
            for (let i = 0; i < units.length; i++) {
                const diff = current - units[i].create_at;
                const hours = diff / (1000 * 60 * 60);
                if (hours > 0) {
                    let res = await this.Datasource.manager.query(`
                        update units
                        set isactive = true
                        where id = ${units[i].unit_id}
                        and tenant = '${tenant}'
                    `)
                }
            }
        }
        return 'success';
    }
}
