import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './common/auth/auth.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [PrismaModule, AuthModule, ModulesModule],
})
export class AppModule {}
