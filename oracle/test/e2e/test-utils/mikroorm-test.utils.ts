import { EntityManager, MikroORM } from '@mikro-orm/postgresql';

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export class MikroOrmTestUtils {
  private orm: MikroORM;
  private em: EntityManager;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV !== test');
    }
  }

  async startServer() {
    this.orm = await MikroORM.init(); // Initialize MikroORM
    this.em = this.orm.em; // Get EntityManager
  }

  async closeServer() {
    await this.orm.close(); // Close MikroORM instance
  }

  saveOne = async <T>(entity: T): Promise<T> => {
    try {
      await this.em.persistAndFlush(entity);
      return entity;
    } catch (e) {
      throw new Error(`Error saving entity: ${e}`);
    }
  };

  saveMany = async <T>(entities: T[]): Promise<T[]> => {
    try {
      await this.em.persistAndFlush(entities);
      return entities;
    } catch (e) {
      throw new Error(`Error saving entities: ${e}`);
    }
  };
}
