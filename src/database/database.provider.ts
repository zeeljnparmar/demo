import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {DB_URL} from '../constants/constants'
import {User} from '../entities/user.entity'
import {Property} from '../entities/property.entity'
import {Units} from '../entities/unit.entity'
import {Bookings} from '../entities/booking.entity'

export const nestpractice:TypeOrmModuleOptions={
    url:DB_URL,
    name:'Servers',
    type:'postgres',
    database:'postgres',
    synchronize:true,
    // logging:true,
    entities:[User,Property,Units,Bookings],

}