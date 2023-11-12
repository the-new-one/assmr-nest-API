import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbacksService } from 'src/service/feedbacks/feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating, UserFeedBack } from 'src/entity/feedbacks/FeedBacks';
import { Company } from 'src/entity/company/Company';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbacksService],
  imports: [TypeOrmModule.forFeature([UserFeedBack, Rating, Company])],
  exports: [TypeOrmModule],
})
export class FeedbackModule {}
