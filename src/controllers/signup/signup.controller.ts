import { Controller, Post, Body } from '@nestjs/common';
import { UserSignupModel } from 'src/models/user/UserModel';
import { SignupService } from 'src/service/signup/signup.service';

@Controller('signup')
export class SignupController {
  constructor(private singupService: SignupService) {}

  @Post()
  createUser(@Body() userForm: UserSignupModel): Promise<ResponseData<[]>> {
    return this.singupService.createUser(userForm);
  }
}
