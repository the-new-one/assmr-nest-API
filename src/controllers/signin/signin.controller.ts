import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ActiveUserCredentialsModel,
  UpdateUserInformationModel,
  UserSigninModel,
} from 'src/models/user/UserModel';
import { SigninService } from 'src/service/signin/signin.service';
import { DataSource } from 'typeorm';

@Controller('signin')
export class SigninController {
  constructor(
    private signinService: SigninService,
    private dataSource: DataSource,
  ) {}

  @Post()
  async signinUserCredentials(
    @Body() userCredentials: UserSigninModel,
  ): Promise<ResponseData<ActiveUserCredentialsModel>> {
    return this.signinService.verifyUserCredentials(userCredentials);
  }
  @Post('updateCredentials')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/user',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async updateCredentials(
    @Body() params: UpdateUserInformationModel,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ResponseData<string>> {
    try {
      let pathList: string = '';
      if (image) pathList = image.path;
      return this.signinService.updateCredentials(params, pathList);
    } catch (err) {
      console.log('singin.controller.ts');
      console.log(err);
    }
  }
  @Get('getPassword/:userEmail')
  getPassword(@Param() param: { userEmail: string }) {
    const { userEmail } = param;
    return this.signinService.getPassword(userEmail);
  }
}
