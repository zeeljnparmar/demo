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