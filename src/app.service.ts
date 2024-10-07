import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async sendResponse(status: number, message: string, data ?: any): Promise<any> {
    let response;
    
      response = {
        status: status,
        message: message,
        data: data
      }
    return response;
   
  }

}
