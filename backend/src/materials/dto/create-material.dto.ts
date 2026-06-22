import { IsString, IsOptional, IsNumber, IsEnum, MinLength } from 'class-validator';

enum MaterialCategory {
  STEEL = 'STEEL',
  ROD = 'ROD',
  GAS = 'GAS',
  CONSUMABLE = 'CONSUMABLE',
  TOOL = 'TOOL',
  OTHER = 'OTHER',
}

export class CreateMaterialDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(MaterialCategory)
  category: MaterialCategory;

  @IsString()
  unit: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  stockQty?: number;

  @IsOptional()
  @IsNumber()
  minStockQty?: number;

  @IsOptional()
  @IsString()
  supplier?: string;
}
