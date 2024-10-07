import {
    Injectable,
    NestInterceptor,
    Inject,
    ExecutionContext,
    CallHandler,
    Logger
  } from '@nestjs/common';
  import * as os from 'node:os';
  import { tap } from 'rxjs/operators';
  import { User } from '../src/dtos/user.dto';
  import jwt_decode from 'jwt-decode';
  import { Metadata } from '@grpc/grpc-js';
  import * as kleur from 'kleur';
//   import { CustomLogger } from 'src/logger/customlogger';
  
  @Injectable()
  export class UserInterceptor implements NestInterceptor {
    private userPermissionService;
    private logger;
    constructor() {}
  
    async intercept(context: any, next: CallHandler): Promise<any> {
      try {
        const now = Date.now();
        if (context['contextType'] !== 'rpc') {
          const request = context.switchToHttp().getRequest();
          if (request.route.path !== '/api/patr/v1/health') {
            
            const cpus = os.cpus();
            const cpu = cpus[0];
  
            // Accumulate every CPU times values
            const total = Object.values(cpu.times).reduce(
              (acc, tv) => acc + tv,
              0,
            );
  
            // Normalize the one returned by process.cpuUsage()
            // (microseconds VS miliseconds)
            const usage = process.cpuUsage();
            const currentCPUUsage = (usage.user + usage.system) / 1000;
  
            // Find out the percentage used for this specific CPU
            const perc = (currentCPUUsage / total) * 100;
            //           const used = process.memoryUsage().heapUsed / 1024 / 1024;
            // console.log(`---------------------------------- Memory used : ${Math.round(used * 100) / 100} MB ----------------------------------`);
            this.logger.log(request.body.requestId , `🛠️--CPU USAGE (%): ${perc} --🛠️`)
  
            let auth = request.headers['authorization'].split('Bearer ');
            console.log(auth);
            let tokenInfo = 'jwt_decode(auth[1]);'
            let user = new User();
            user.tenant_id = tokenInfo['https://custom-claims.vinculumgroup.com/tenant_id'];
            user.org_id = tokenInfo['https://custom-claims.vinculumgroup.com/org_id'];
            user.user_id = tokenInfo['https://custom-claims.vinculumgroup.com/userid'];
            user.request_source = tokenInfo['https://custom-claims.vinculumgroup.com/request_source'];
            let metadata = new Metadata();
            metadata.add('tenant_id', user.tenant_id);
            metadata.add('org_id', user.org_id);
            metadata.add('user_id', user.user_id);
  
            const now = Date.now();
            let userInf = await this.userPermissionService.GetUserById(
              { userid: String(user.user_id) },
              metadata,
            );
            let userInformation = await userInf.toPromise();
            user.id=user.user_id;
  
            user.user_id = userInformation.data[0].user_name;
            request.body['user'] = user;
          }
  
          return next.handle().pipe(
            tap(() => {
              if (request.route.path !== '/api/patr/v1/health') {
                
              }
            }),
          );
        } else {
          
          this.logger.log(context.UUID, 
              `${kleur.yellow(' [rpc-request-📡]')}`+
              `${kleur.green(`------${context.getHandler().name}---------`)}`,
          );
          return next.handle().pipe(
            tap(() => {
            }),
          );
        }
      } catch (err) {
        console.log(null, err)
        this.logger.error(err);
      }
    }
  }
  