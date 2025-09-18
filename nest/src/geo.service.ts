import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeoService {
    constructor(private http: HttpService) { }

    async process(dto: any) {
        const url = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        try {
            const res = await firstValueFrom(this.http.post(`${url}/process`, dto));
            return res.data;
        } catch (e: any) {
            const msg = e?.response?.data?.detail || e?.response?.data?.message || 'Error en servicio Python';
            throw new BadRequestException(msg);
        }
    }
}