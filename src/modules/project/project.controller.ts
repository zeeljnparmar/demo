import { Body, Controller, Post } from '@nestjs/common';
import {ProjectService} from './project.service'
@Controller('project')
export class ProjectController {

    constructor(
        private readonly project:ProjectService
    ) {}

    @Post('create')
    private async createProject(
        @Body() body:any
    ){
        console.log(body);
    }
}
