import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { userCheckService } from '../users/user.check';
import { BookingsController } from './bookings.controller';

@Module({
  imports:[forwardRef(() => AppModule)],
  providers:[BookingsService,userCheckService,AppService],
  controllers:[BookingsController],
  exports:[BookingsService]
})
export class BookingsModule {}
