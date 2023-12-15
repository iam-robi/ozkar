import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
