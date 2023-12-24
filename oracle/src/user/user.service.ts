import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseService } from '../base/base.service';
// import {UserRepository} from "./user.repository";
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: EntityRepository<User>,
  ) {
    super(repository);
  }

  async findByAddress(address: string): Promise<User> {
    return await this.repository.findOne({
      address,
    });
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      email,
    });
  }
  async findOneByUsername(username: string): Promise<User> {
    return await this.repository.findOne({
      username,
    });
  }

  async findOneBySocialId(socialId: string): Promise<User> {
    return await this.repository.findOne({
      socialId,
    });
  }

  async existsByCredentials(
    user: Pick<User, 'email' | 'username'>,
  ): Promise<boolean> {
    const email = user.email;
    const username = user.username;

    const result = await this.repository
      .createQueryBuilder()
      .where({ email: email })
      .orWhere({ username: username })
      .count()
      .execute();

    const count = result[0].count;

    return count > 0;
  }

  async findOne(address: string): Promise<User> {
    return await this.repository.findOne({
      address,
    });
  }
}
