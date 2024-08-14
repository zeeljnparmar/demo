import { ApiProperty } from '@nestjs/swagger'

export class userDto {

    @ApiProperty({nullable:false})
    name:string
    
    @ApiProperty({nullable:false})  
    email: string

    @ApiProperty({nullable:false})
    contact : number
    
    @ApiProperty({nullable:false})
    gender: string
    
    @ApiProperty({nullable:false})
    address: string
    
    @ApiProperty({nullable:false})
    rera: string
    
    @ApiProperty({nullable:false})
    company: string
    
    @ApiProperty({nullable:false})
    password: string
    
    @ApiProperty({nullable:false})
    designation : string

}