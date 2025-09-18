import { IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
    @IsNumber() @Min(-90) @Max(90)
    lat: number;

    @IsNumber() @Min(-180) @Max(180)
    lng: number;
}

export class PointsRequestDto {
    @IsArray() @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PointDto)
    points: PointDto[];
}