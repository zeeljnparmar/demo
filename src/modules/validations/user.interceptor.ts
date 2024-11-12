import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { of, tap } from "rxjs";
import {jwt} from '../../constants/constants'
import { JwtService } from "@nestjs/jwt";
import { AppService } from "src/app.service";

@Injectable()
export class userInterceptor implements NestInterceptor {
    constructor(
        @Inject(AppService)
        private service: AppService,
        
        private jwtService: JwtService
    ){}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const request = context.switchToHttp().getRequest();
        let token = request.cookies.token
        let decoded= await this.jwtService.verifyAsync(token,{ secret: jwt})
        if(decoded.designation==='Admin' || decoded.designation==='Super Admin'){
            request.body['tenant'] = decoded.tenant;
            request.body['user_id'] = decoded.id;
            return next.handle().pipe(tap(() => { }))
        }
        return this.service.sendResponse(409,'Invalid User')
    }
}