import { AppUpdate } from './app.update';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { AppService } from './app.service';
import { PrismaService } from './commons/prisma/prisma.service';
import { PrismaModule } from './commons/prisma/prisma.module';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TOKEN,
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [AppService, AppUpdate, PrismaService],
  exports: [PrismaModule],
})
export class AppModule {}
