import { Body, Controller, Post ,Req, UseInterceptors} from '@nestjs/common';
import {ProjectService} from './project.service'
import {projectDto,insertunit,unitDto} from '../../dtos/project.dto'
import {  ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Response, Request} from 'express';
import {userInterceptor} from '../validations/user.interceptor';
import { ppid } from 'process';

@ApiTags('Projects')
@Controller('project')
// @UseInterceptors(userInterceptor)
export class ProjectController {
    constructor(
        private readonly project:ProjectService
    ) {}

    //?=================for User===========================//
    @Post('view-all')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async viewAll(){
        return await this.project.viewAllProject();
    }

    //? For all units of a project 
    @Post('view-all-units')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async viewProject(@Body() body){
        return await this.project.viewAllProjectunits(body);
    }

    //?=================for Admin===========================//
    @Post('create')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async createProject(
        @Body() body:projectDto,
    ){
        return await this.project.createProject(body);
    }
    @Post('insert-unit')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async insertUnits(
        @Body() body:insertunit        
    ){
        return await this.project.insertUnits(body);
    }
    @Post('update-unit')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201})
    private async updateUnit(
        @Body() body:any
    ){
        return await this.project.updateUnit(body);
    }
    @Post('delete-unit')
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201})
    private async deleteUnit(
        @Body() body:any
    ){
        return await this.project.deleteUnit(body.id,body.user_id);
    }
    @Post(`generate-template`)
    @ApiOperation({summary:''})
    @ApiResponse({ status: 201})
    private async generate()
    {
        return await this.project.generatetemplate()
    }
}

