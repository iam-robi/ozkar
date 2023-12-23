import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './user/user.module';
import { SignModule } from './sign/sign.module';
import GraphQLJSON from 'graphql-type-json';
import { AuthModule } from './auth/auth.module';
// import { AppleModule } from './src/apple/apple.module';
import { AppleResolver } from './apple/apple.resolver';
import { AuthResolver } from './auth/auth.resolver';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      debug: false,
      playground: true,
      introspection: true,
      persistedQueries: false,
      resolvers: { JSON: GraphQLJSON },
      cors: {
        origin: /^(.*)/,
        credentials: true,
      },
    }),
    UserModule,
    SignModule,
    AuthModule,
    // AppleModule,
  ],
  providers: [AuthResolver],
})
export class AppModule {}
