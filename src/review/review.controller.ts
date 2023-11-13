import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CustomAuthGuard } from 'src/common/guards/auth.guard';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/')
  @UseGuards(CustomAuthGuard)
  postReview(@Body() reviewDto: ReviewDto) {
    this.reviewService.postReview(reviewDto);
  }
}
