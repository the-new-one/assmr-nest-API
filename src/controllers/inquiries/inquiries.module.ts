import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from 'src/service/inquiries/inquiries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiries } from 'src/entity/inquiries/Inquiries';
import { Notifications } from 'src/entity/notifications/Notifications';

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService],
  imports: [TypeOrmModule.forFeature([Inquiries, Notifications])],
  exports: [TypeOrmModule],
})
export class InquiriesModule {}
