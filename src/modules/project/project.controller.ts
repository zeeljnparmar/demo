import { Body, Controller, Post ,Req} from '@nestjs/common';
import {ProjectService} from './project.service'
import {projectDto} from '../../dtos/project.dto'
import {  ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Response, Request} from 'express';

@ApiTags('Projects')
@Controller('project')
export class ProjectController {

    constructor(
        private readonly project:ProjectService
    ) {}

    //?=================for User===========================//
    @Post('view')
    private async viewAll(){
        
    }
    @Post('view')
    private async viewProject(@Body() body:{id:number}){
        return this.project.viewAProject(body.id);
    }
    //?=================for Admin===========================//
    @Post('create')
    @ApiOperation({ summary: '' })
    @ApiResponse({ status: 201, type: 'abcd' })
    private async createProject(
        @Body() body:projectDto,
        @Req() request:Request
    ){
        const cookie = request.cookies;
        console.log(cookie);
        //return await this.project.createProject(body);
    }
}

