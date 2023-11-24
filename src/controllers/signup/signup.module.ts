import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from 'src/service/signup/signup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from 'src/entity/signup/signup.entity';
import { UserSubscription } from 'src/entity/subscription/Subscription';
import { Company } from 'src/entity/company/Company';

@Module({
  controllers: [SignupController],
  providers: [SignupService],
  imports: [
    TypeOrmModule.forFeature([User, Account, UserSubscription, Company]),
  ],
})
export class SignupModule {
  constructor() {}
}
