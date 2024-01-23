import { Controller } from '@nestjs/common';
import { RoomService } from './service';

@Controller('/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
}
