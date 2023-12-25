import { Migration } from '@mikro-orm/migrations';

export class Migration20231225230926 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(255) null, "password" varchar(255) null, "username" varchar(255) null, "address" varchar(255) not null, "age" int null, "gender" int null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "social_provider" ("id" serial primary key, "provider" text check ("provider" in (\'facebook\', \'google\')) not null, "social_id" varchar(255) not null, "user_id" uuid not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "social_provider" add constraint "social_provider_social_id_unique" unique ("social_id");');

    this.addSql('alter table "social_provider" add constraint "social_provider_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "social_provider" drop constraint "social_provider_user_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "social_provider" cascade;');
  }

}
