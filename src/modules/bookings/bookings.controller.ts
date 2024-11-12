import { ApiTags } from '@nestjs/swagger';
import { userInterceptor } from '../validations/user.interceptor';
import { BookingsService } from './bookings.service';
import { Body, Controller, Post ,Req, UseInterceptors} from '@nestjs/common';

@Controller('bookings')
@ApiTags('Bookings')
@UseInterceptors(userInterceptor)
export class BookingsController {
    constructor(
        private readonly booking:BookingsService
    ) {}

}
