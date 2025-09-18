import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';

@Module({
  imports: [
    HttpModule.register({ timeout: 3000 }),
    CacheModule.register({ ttl: 60, max: 100 })
  ],
  controllers: [GeoController],
  providers: [GeoService]
})
export class AppModule {}