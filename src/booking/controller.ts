import { Controller } from '@nestjs/common/decorators';
import { BookingService } from './service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
}
