import type { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new UserFactory(em).make(100);
  }
}
