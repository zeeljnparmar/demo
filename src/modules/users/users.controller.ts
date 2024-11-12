import { Controller,Get,Post,Body, UseGuards, Res, Req} from '@nestjs/common';
import {UsersService} from './users.service'
import {userDto} from '../../dtos/user.dto'
import {  ApiOperation, ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import {Response, Request} from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Post('login')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async login(
        @Body() body:any ,
        @Res({passthrough: true}) response: Response
    ){
        const res=await this.userService.login(body);
        if(res.status === 201){
            response.cookie('token', res.data,{httpOnly:true});
            delete res.data;
        }
        return res;
    }
    
    // @Post('sign-up')
    // private async signup(){}

    @Post('create')
    @ApiOperation({ summary: ''})
    @ApiResponse({ status: 201, type: 'abcd' })
    private async create(
        @Body() user:userDto,
        
    ):Promise<any>{ 
        
        return await this.userService.createUser(user);
    }

    @Get('get-all')
    // @UseGuards(AuthorizationGuard)
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async getAllUsers(@Req() request:Request):Promise<any>{
        
        const res=this.userService.getAllUsers();
        return res;
    }

    @Post('get-a-user')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async getSingle(
        @Body() body:any
    ):Promise<any>{
        const res= this.userService.getSingleUser(body);
        return res;
    }
}
