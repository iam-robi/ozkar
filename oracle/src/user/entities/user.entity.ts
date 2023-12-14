import {ObjectType, Field, Int, ID} from '@nestjs/graphql';
import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Gender} from "../enums";
import * as crypto from "crypto";

@Entity()
@ObjectType()
export class User {

  @Field(() => ID)
  @PrimaryKey({ type: 'uuid'})
  id: string = crypto.randomUUID();

  @Field({ nullable: true })
  @Property({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  email: string;

  @Field()
  @Property()
  address: string;

  @Field({ nullable: true })
  @Property({nullable: true})
  age: Number;

  @Field({ nullable: true })
  @Property({nullable: true})
  gender: Gender;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
  //
  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();


}
