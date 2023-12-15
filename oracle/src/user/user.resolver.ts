import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { SignService } from '../sign/sign.service';
import { SignedUser } from './dto/get-signed-user-data.response';
import { CurrentUserAddress } from './helpers/currentuseraddress.decorator';
import SignedTrainingData from './dto/signed-training-data.response';
import { TrainingDataInput } from './dto/training-data.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private signService: SignService,
  ) {}

  @Query(() => SignedUser, { name: 'userProfile' })
  // @UseGuards(SSXGuard)
  async getUserProfile(@CurrentUserAddress() address: string) {
    const userData = await this.userService.findByAddress(address);
    const signedData = this.signService.minaSign(userData);
    return signedData;
  }
}
