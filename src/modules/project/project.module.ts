import { forwardRef, Module } from '@nestjs/common';
import {ProjectService} from './project.service'
import {ProjectController} from './project.controller'
import { AppModule } from 'src/app.module';
import { userCheckService } from '../users/user.check';
import { AppService } from 'src/app.service';

@Module({
    imports:[forwardRef(() => AppModule)],
    providers:[ProjectService,userCheckService,AppService],
    controllers:[ProjectController],
    exports:[ProjectService]
})
export class ProjectModule {}
