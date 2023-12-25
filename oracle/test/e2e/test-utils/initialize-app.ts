import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { MikroOrmTestUtils } from './mikroorm-test.utils';

import { GraphqlConfigService } from '../../../config/graphql.config';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { MikroOrmConfigService } from '../../../config/mikroorm.config';
import { MikroOrmTestConfigService } from '../../config/mikroorm.config';
import { INestApplication } from '@nestjs/common';

export interface E2EApp {
  app: INestApplication;
  dbTestUtils: MikroOrmTestUtils;
  cleanup: () => void;
}

export async function initializeApp() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule, MikroOrmTestUtils],
  })
    .overrideProvider(GraphqlConfigService)
    .useClass(GraphqlTestConfigService)
    .overrideProvider(MikroOrmConfigService)
    .useClass(MikroOrmTestConfigService)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const dbTestUtils = app.get(MikroOrmTestUtils);
  await dbTestUtils.startServer();

  const cleanup = async () => {
    await dbTestUtils.closeServer();
    await app.close();
  };

  return { app, dbTestUtils, cleanup };
}
