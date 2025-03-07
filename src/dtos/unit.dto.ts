import { ApiProperty } from '@nestjs/swagger'
import {
    IsString,
    IsNumber,
    Matches,
    IsBoolean,
    IsArray,
    IsOptional,
    ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9_& ]*$/;

export class CreateUnit{
    
}

export class BookUnits{
    @ApiProperty()
    bookingDate: string;
    @ApiProperty()
    remarks?: string;
    @ApiProperty()
    created_at:Date
    @ApiProperty()
    customer?:string;
    @ApiProperty()
    duration?:number
    @ApiProperty()
    email?:string
    @ApiProperty()
    budget?:number
    @ApiProperty()
    area?:string
    @ApiProperty()
    category?:string;
    @ApiProperty()
    tenant:string;
    @ApiProperty()
    is_Active: boolean;      
    @ApiProperty()
    user_id:number
    @ApiProperty()
    unit_id:number
    @ApiProperty()
    property_id:number
}
