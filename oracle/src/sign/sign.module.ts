import { Module } from '@nestjs/common';
import { SignService } from './sign.service';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [SignService],
  exports: [SignService],
})
export class SignModule {}
