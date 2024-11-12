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
export class unitDto{

    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    @ApiProperty()
    type:string

    @ApiProperty()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    block:string

    @ApiProperty()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    floor:string

    @ApiProperty()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    unit_no:string

    @ApiProperty()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    unit_size:string

    @ApiProperty({default:true})    
    isactive:boolean

    @ApiProperty({default:'sale'})
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    status:string

} 

export class insertunit{

    @ApiProperty()
    @IsOptional()
    property_id?:number

    @ApiProperty({default:'AMH0001'})
    @IsOptional()
    tenant:string   

    @ApiProperty()
    @IsOptional()
    user_id?:number


    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => unitDto)
    units: unitDto[];
}
export class projectDto {

    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    display_name:string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))  
    description: string

    @ApiProperty({default:true})
    @IsBoolean()
    is_Active : boolean
    
    @ApiProperty({default:"Upcoming"})
    status:string

    @ApiProperty({nullable:false})
    user_id: number

    @ApiProperty({default:'AHM0001'})
    tenant:string
}  

export class insertProject {
    attributes
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))
    display_name:string
    
    @ApiProperty({nullable:false})
    @IsString()
    @Matches(ALPHANUMERIC_REGEX,({message:"Must not contain any special characters"}))  
    description: string

    @ApiProperty({default:true})
    @IsBoolean()
    is_Active : boolean
    
    @ApiProperty({default:"Upcoming"})
    status:string

    @ApiProperty({nullable:false})
    user_id: number

    @ApiProperty()
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>unitDto)
    units:unitDto

    @ApiProperty({default:'AHM0001'})
    tenant:string
}  

