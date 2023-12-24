import { User } from '../user/entities/user.entity';
import { registerEnumType, Field, Int, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Unique,
  ManyToOne,
} from '@mikro-orm/core';

export enum SocialProviderTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialProviderTypes, {
  name: 'SocialAuthProviders',
});

@Entity()
@ObjectType()
export class SocialProvider {
  @Field(() => Number)
  @PrimaryKey({ type: 'number' })
  id: number;

  @Enum(() => SocialProviderTypes)
  provider: SocialProviderTypes;

  @Field(() => String)
  @Property({ unique: true })
  socialId: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @Property()
  createdAt: Date = new Date();
}
