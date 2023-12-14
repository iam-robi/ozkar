import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs';
import {BaseService} from "../base/base.service";
// import {UserRepository} from "./user.repository";
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: EntityRepository<User>,
  ) {
    super(repository)
  }

  async findByAddress(address: string): Promise<User> {
    return await this.repository.findOne({
      address
    })
  }

}
