import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryKey,
  Property,
  BeforeCreate,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Gender } from '../enums';
import { randomBytes, randomUUID, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

import { SocialProvider } from '../../auth/auth.entity';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Field({ nullable: true })
  @Property({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  email: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  password: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  username: string;

  @Field()
  @Property()
  address: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  age: Number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  gender: Gender;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
  //
  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => SocialProvider, (socialProvider) => socialProvider.user)
  @Field(() => [SocialProvider], { nullable: true })
  socialProviders = new Collection<SocialProvider>(this);

  @BeforeCreate()
  async hashPassword() {
    if (this.password) {
      // Generate a random salt
      const salt = randomBytes(16).toString('hex');

      // Hash the password with the salt
      const hash = (await scrypt(this.password, salt, 64)) as Buffer;

      // Combine the salt and the hash
      this.password = `${salt}:${hash.toString('hex')}`;
    }
  }

  async comparePassword(inputPassword: string): Promise<boolean> {
    if (!this.password) return false;

    // Split the stored password into salt and hash
    const [salt, storedHash] = this.password.split(':');

    // Hash the input password with the stored salt
    const hash = (await scrypt(inputPassword, salt, 64)) as Buffer;

    return storedHash === hash.toString('hex');
  }
}
