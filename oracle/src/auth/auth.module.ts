import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import googleConfig from '../../config/google.config';
import facebookConfig from '../../config/facebook.config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { SocialProviderRepository } from './auth.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { SocialProvider } from './auth.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

// import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    ConfigService,
    ConfigModule,
    {
      provide: SocialProviderRepository,
      useFactory: (em: EntityManager) => em.getRepository(SocialProvider),
      inject: [EntityManager],
    },
    JwtService,
  ],
  exports: [AuthService],
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleConfig),
    ConfigModule.forFeature(facebookConfig),
    //MikroOrmModule.forFeature([SocialProviderRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signInOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
