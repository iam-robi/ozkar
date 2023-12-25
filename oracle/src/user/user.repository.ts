import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';

export class UserRepository extends EntityRepository<User> {
  async existsByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<boolean> {
    const count = await this.createQueryBuilder('user')
      .where({ email })
      .orWhere({ username })
      .getCount();

    return count > 0;
  }

  async findOneBySocialId(socialId: string): Promise<User | null> {
    // Use QueryBuilder with proper syntax for conditions
    const result = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.socialProviders', 'providers')
      .where({ 'providers.socialId': socialId }) // Corrected where clause
      .getResult()[0];

    return result;
  }
}
