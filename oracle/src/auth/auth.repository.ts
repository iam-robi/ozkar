import { EntityRepository } from '@mikro-orm/postgresql';
import { SocialProvider } from './auth.entity';
import { User } from '../user/entities/user.entity';

// @EntityRepository(SocialProvider)
export class SocialProviderRepository extends EntityRepository<SocialProvider> {
  async existsBySocialId(socialId: string): Promise<boolean> {
    const result = await this.createQueryBuilder('provider')
      .where({ socialId })
      .count()
      .execute();

    // Extract the count from the first element of the result array
    const count = result[0].count;

    return count > 0;
  }

  saveProviderAndUser(user: Partial<User>, provider: Partial<SocialProvider>) {
    return this.em.transactional(async (em) => {
      const createdUser = em.create(User, user);
      await em.persistAndFlush(createdUser);

      const socialProvider = em.create(SocialProvider, {
        ...provider,
        user: createdUser,
      });
      await em.persistAndFlush(socialProvider);

      return createdUser;
    });
  }
}
