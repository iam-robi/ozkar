// !!! used by localhost not docker , config not read by production app either
import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';

import { LoadStrategy } from '@mikro-orm/core';

const config: Options = {
  entities: ['dist/src/**/entities/**.entity{.ts,.js}'],
  entitiesTs: ['src/**/entities/**.entity{.ts,.js}'],
  // entities: [Registration],
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dbName: process.env.DB_DATABASE,
  port: Number(process.env.PG_PORT),
  type: 'postgresql',
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'database/migrations',
    disableForeignKeys: false,
  },
  seeder: {
    defaultSeeder: 'DatabaseSeeder',
    //generated seeder must be moved from dist to src folder (error)
    path: 'dist/database/seeders',
    // pathTs is not changing output
    pathTs: './database/seeders',
  },
};

export default config;
