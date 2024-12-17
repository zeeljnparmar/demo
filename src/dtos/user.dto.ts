import { ApiProperty } from '@nestjs/swagger'
import {
    IsString,
    IsNumber,
    Matches
} from 'class-validator'

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9_ -&]*$/;

export class userDto {

    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    name:string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))  
    email: string

    @ApiProperty()
    @IsNumber()
    contact : string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    gender: string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    address: string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    rera: string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    company: string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    password: string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    designation : string

}

export class User {
    tenant_id: string;
    org_id: string;
    user_id: string;
    request_source ?: string;
    id?:string;
}
