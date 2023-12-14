import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { SignModule } from '../sign/sign.module';
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User] }), SignModule],
})
export class UserModule {}
