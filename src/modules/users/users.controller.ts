import { Controller,Get,Post,Body, UseGuards, Res, Req, UseInterceptors} from '@nestjs/common';
import {UsersService} from './users.service'
import {userDto} from '../../dtos/user.dto'
import {  ApiOperation, ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import {Response, Request} from 'express';
import { userInterceptor } from '../validations/user.interceptor';
@ApiTags('Users')
@Controller('users')
@UseInterceptors(userInterceptor)
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
    private async getAllUsers(@Body() body:any):Promise<any>{
        const res=this.userService.getAllUsers(body.tenant,body.user_id);
        return res;
    }

    @Post('get-a-user')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async getSingle(
        @Body() body:any
    ):Promise<any>{
        const res= await this.userService.getSingleUser(body);
        return res;
    }
    @Get('get-pending-approvals')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201, type: 'abcd' })
    private async viewpending(@Body() body:any) {
        return await this.userService.viewPending(body.user_id,body.tenant)
    }

    @Post('approve-user')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201, type: 'abcd' })
    private async approveUser(@Body() body:any){
        try {
            return await this.userService.approvePending(body.id,body.user_id,body.tenant);
        } catch (error) {
            console.log(error)
            return 'Internal error has occured'
        }
    }
    @Post('deactivate-user')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201, type: 'abcd' })
    private async deleteUser(@Body() body:any){
        try {
            return await this.userService.deleteuser(body.id,body.user_id,body.tenant);
        } catch (error) {
            console.log(error)
            return 'Internal error has occured'
        }
    }
}
