import { Query, Resolver } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  @Query(() => String, { name: 'authGoogleLogin' })
  //   @UseGuards(AuthGuard('apple'))
  async authGoogleLogin() {
    return 'HttpStatus.OK';
  }
}
