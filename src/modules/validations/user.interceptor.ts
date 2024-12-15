import { CallHandler, ExecutionContext, forwardRef, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";
import {jwt} from '../../constants/constants'
import { JwtService } from "@nestjs/jwt";
import { AppService } from "src/app.service";
import {validate} from './constant'
import {userCheckService} from '../users/user.check'

@Injectable()
export class userInterceptor implements NestInterceptor {
    constructor(
        @Inject(AppService)
        private service: AppService,

        @Inject(forwardRef(() => userCheckService))
        private userCheck: userCheckService,

        
        private jwtService: JwtService
    ){}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const request = context.switchToHttp().getRequest();
        if(request.path==='/users/login'){
            return next.handle().pipe(tap(() => { }))
        }
        let token = request.cookies.token
        let decoded= await this.jwtService.verifyAsync(token,{ secret: jwt})
        if(decoded.designation==='Admin' || decoded.designation==='Super Admin'){
            request.body['tenant'] = decoded.tenant;
            request.body['user_id'] = decoded.id;
            if(request.path in validate){   
                let user = await this.userCheck.checkById(request.body['user_id']);   
                if(user=='Brooker'){
                    return this.service.sendResponse(409,'Invalid User')
                }
            }
            return next.handle().pipe(tap(() => { }))
        }
        return this.service.sendResponse(409,'Invalid User')
    }
}