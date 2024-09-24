import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {DB_HOST,DB_PASSWORD,DB_PORT,DB_USER} from '../env.constant'
import {User} from '../entities/user.entity'
import {Property} from '../entities/property.entity'
import {Units} from '../entities/unit.entity'
import {Bookings} from '../entities/booking.entity'

export const nestpractice:TypeOrmModuleOptions={
    name:'Servers',
    type:'postgres',
    host:DB_HOST,
    port:parseInt(DB_PORT),
    username:'nestpractice',
    password:'nezfur@357',
    database:'postgres',
    synchronize:true,
    logging:true,
    entities:[User,Property,Units,Bookings]
}