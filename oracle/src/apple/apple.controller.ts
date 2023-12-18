//TODO: replace with resolver + traefik for http to test apple login
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

@Controller('/apple')
export class AppleController {
  constructor(private sService: AppleService) {}
  @Get()
  @UseGuards(AuthGuard('apple'))
  async login(): Promise<any> {
    return HttpStatus.OK;
  }

  @Post('/redirect')
  async redirect(@Body() payload): Promise<any> {
    if (payload.id_token) {
      return this.sService.registerByIDtoken(payload);
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
