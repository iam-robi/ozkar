import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SocialProviderRepository } from './auth.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { SocialProvider } from './auth.entity';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UserService,
        {
          provide: SocialProviderRepository,
          useFactory: (em: EntityManager) => em.getRepository(SocialProvider),
          inject: [EntityManager],
        },
        {
          provide: UserRepository,
          useFactory: (em: EntityManager) => em.getRepository(User),
          inject: [EntityManager],
        },
      ],
      imports: [MikroOrmModule.forRoot(), UserModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
