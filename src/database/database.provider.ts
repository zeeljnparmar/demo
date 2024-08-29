import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {DB_HOST,DB_PASSWORD,DB_PORT,DB_USER} from '../env.constant'
import {User} from '../entities/user.entity'
import {Property} from '../entities/property.entity'
import {Units} from '../entities/unit.entity'
export const nestpractice:TypeOrmModuleOptions={
    name:'practice',
    type:'postgres',
    host:DB_HOST,
    port:parseInt(DB_PORT),
    username:'master',
    password:'nezfur@357',
    database:'nestpractice',
    synchronize:true,
    // logging:true,
    entities:[User,Property,Units]
}