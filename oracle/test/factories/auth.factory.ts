import { User } from '../../src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { Profile } from 'passport';
import { faker } from '@faker-js/faker';
import {
  SocialProvider,
  SocialProviderTypes,
} from '../../src/auth/auth.entity';
import { LoginSocialInput } from '../../src/auth/inputs/login-social.input';
import { RegisterSocialInput } from '../../src/auth/inputs/register-social.input';
import { FactoryBuilder } from 'factory.io';

const conf = jwtConfig();
const jwtService = new JwtService({
  secretOrPrivateKey: conf.secret ?? 'jwt',
  signOptions: {
    expiresIn: conf.expiresIn ?? '7 days',
  },
});

export function tokenFactory(user: Partial<User>) {
  return jwtService.sign({ username: user.username });
}

export function authHeaderFactory(user: Partial<User>) {
  const token = tokenFactory(user);
  return `Bearer ${token}`;
}

export const loginSocialInputFactory = FactoryBuilder.of(LoginSocialInput)
  .props({
    accessToken: () => faker.string.uuid(),
    provider: () =>
      faker.helpers.arrayElement(Object.values(SocialProviderTypes)),
  })
  .build();

export const registerSocialInputFactory = FactoryBuilder.of(RegisterSocialInput)
  .mixins([loginSocialInputFactory])
  .props({ username: faker.internet.userName })
  .build();

const emailFactory = FactoryBuilder.of<Email>()
  .props({ value: faker.internet.email })
  .build();

export const socialProfileFactory = FactoryBuilder.of<Profile>()
  .props({
    provider: () =>
      faker.helpers.arrayElement(Object.values(SocialProviderTypes)),
    id: faker.string.uuid(),
    displayName: faker.internet.userName,
    emails: emailFactory.buildMany(2),
  })
  .build();

interface Email {
  value: string;
}

export const socialProviderFactory = FactoryBuilder.of(SocialProvider)
  .props({
    provider: () =>
      faker.helpers.arrayElement(Object.values(SocialProviderTypes)),
    socialId: faker.string.uuid(),
    createdAt: faker.date.future,
  })
  .build();
