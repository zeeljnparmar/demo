import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let len = (request.headers['authorization']).length;
    let tokenInfo = jwtDecode((request.headers['authorization']).slice(6,len));
    console.log(tokenInfo);
    return true;
  }
}
