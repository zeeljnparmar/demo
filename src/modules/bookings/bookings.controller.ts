import { Body, Controller, Post ,Req, UseInterceptors} from '@nestjs/common';
import {BookingsService} from './bookings.service'
import {projectDto,insertunit,unitDto} from '../../dtos/project.dto'
import {  ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {userInterceptor} from '../validations/user.interceptor';
import { BookUnits } from 'src/dtos/unit.dto';


@ApiTags('Booking')
@Controller('booking')
@UseInterceptors(userInterceptor)
export class BookingsController {
    constructor(
        private readonly boking:BookingsService
    ) {}

    //?=================for User===========================//
    @Post('book-unit')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async bookUnit(@Body() body:BookUnits){
        const d = new Date();
        let day=d.toISOString().split('T')[0]
        body.bookingDate=day;
        body.created_at=d;
        return await this.boking.bookUnit(body);
    }
    @Post('view')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async viewProject(@Body() body){
        return 0;
    }
    //?=================for Admin===========================//
    @Post('create')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async createProject(
        @Body() body:projectDto,
    ){
        return 0;
    }
    @Post('insert-unit')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async insertUnits(
        @Body() body:insertunit        
    ){
        return 0;
    }
    @Post('update-unit')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201})
    private async updateUnit(
        @Body() body:any
    ){
        return 0;
    }
    @Post('delete-unit')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201})
    private async deleteUnit(
        @Body() body:any
    ){
        return 0;
    }
}

