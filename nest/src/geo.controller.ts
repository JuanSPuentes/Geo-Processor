import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { PointsRequestDto } from './geo.dto';
import { GeoService } from './geo.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('geo')
@UseInterceptors(CacheInterceptor)
export class GeoController {
    constructor(private readonly svc: GeoService) { }

    @Post('process')
    async process(@Body() dto: PointsRequestDto) {
        return this.svc.process(dto);
    }
}