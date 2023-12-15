import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user/user.service';

@Injectable()
export class SSXGuard {
  constructor(private userService: UserService) {}

  async canActivate(context) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const ssx = req.ssx;

    console.log(req.headers.cookie);
    console.log(ssx.getExpressSessionConfig());

    console.log('ssx', ssx.verified);
    if (!ssx.verified) {
      console.log('Not Signed In with an EVM Chain');
      throw new UnauthorizedException();
    }

    if (ssx.verified) {
      let user = await this.userService.findByAddress(ssx.siwe.data.address);
      if (!user) {
        user = await this.userService.save({
          address: ssx.siwe.data.address,
        });
        console.log('user created');
      } else {
        console.log('user exists');
      }
    }

    return true;
  }
}
