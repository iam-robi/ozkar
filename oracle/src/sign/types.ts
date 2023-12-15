import { Signature, PublicKey } from 'o1js';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import GraphQLJSON from 'graphql-type-json';

export interface ISignedType<T> {
  data: T;
  signature: Signature;
  publicKey: PublicKey;
}

export function Signed<T>(classRef: Type<T>): Type<ISignedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class SignedType implements ISignedType<T> {
    @Field((type) => classRef)
    data: T;

    @Field(() => GraphQLJSON)
    signature: Signature;

    @Field((type) => String)
    publicKey: PublicKey;
  }
  return SignedType as Type<ISignedType<T>>;
}
