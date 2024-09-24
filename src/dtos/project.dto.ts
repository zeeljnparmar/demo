import { ApiProperty } from '@nestjs/swagger'
import {
    IsString,
    IsNumber,
    Matches,
    IsBoolean
} from 'class-validator'

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9_ -&]*$/;

export class projectDto {

    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    display_name:string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))  
    description: string

    @ApiProperty({nullable:false})
    @IsBoolean()
    is_Active : boolean
    
    @ApiProperty({nullable:false})
    @IsNumber()
    user_id: number
    
}