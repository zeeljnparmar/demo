import { forwardRef, Module } from '@nestjs/common';
import {AuthorizationGuard} from './authorization.guard'
import { AppModule } from 'src/app.module';

@Module({
    imports:[
        forwardRef(()=>AppModule)
    ],
    providers: [ AuthorizationGuard],
    exports: [ AuthorizationGuard],
    controllers: []
  })
export class AuthorizationModule {}
