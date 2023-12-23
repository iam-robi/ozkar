import { Resolver, Query } from '@nestjs/graphql';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppleService } from './apple.service';

@Resolver()
export class AppleResolver {
  // @Query(() => String, { name: 'appleLogin' })
  // //   @UseGuards(AuthGuard('apple'))
  // async appleLogin(): Promise<any> {
  //   return 'HttpStatus.OK';
  // }
}

//   @Query(() => HttpStatus, { name: 'redirect' })
// @UseGuards(SSXGuard)
//   @UseGuards(AuthGuard('apple'))
//   async redirect(@Body() payload): Promise<any> {
//     if (payload.id_token) {
//       return this.sService.registerByIDtoken(payload);
//     }
//     throw new UnauthorizedException('Unauthorized');
//   }
