import { Injectable } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';

@Injectable()
export class MikroOrmTestConfigService implements MikroOrmOptionsFactory {
  createMikroOrmOptions(): MikroOrmModuleOptions {
    return {
      type: 'postgresql', // Mikro-ORM uses 'postgresql' instead of 'postgres'
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER, // Note: In Mikro-ORM, it's 'user', not 'username'
      password: process.env.DB_PASSWORD,
      dbName: process.env.DB_DEV, // Note: In Mikro-ORM, it's 'dbName', not 'database'
      entities: ['./dist/**/*.entity.js'], // Specify the path to your compiled entities
      autoLoadEntities: true, // Automatically load entities (optional)
      synchronize: true, // Be cautious with this in production!
    } as Options;
  }
}
