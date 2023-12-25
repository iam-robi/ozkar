import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
//import { SignModule } from '../sign/sign.module';
import { SignModule } from '../sign/sign.module';
import { AuthModule } from '../auth/auth.module';

import { UserRepository } from './user.repository';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
@Module({
  providers: [
    UserResolver,
    UserService,
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => em.getRepository(User),
      inject: [EntityManager],
    },
  ],
  exports: [MikroOrmModule, UserService],
  imports: [MikroOrmModule.forFeature([User]), SignModule],
})
export class UserModule {}
