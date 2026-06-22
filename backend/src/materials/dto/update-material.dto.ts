import { IsString, IsOptional, IsNumber, IsEnum, MinLength } from 'class-validator';

enum MaterialCategory {
  STEEL = 'STEEL',
  ROD = 'ROD',
  GAS = 'GAS',
  CONSUMABLE = 'CONSUMABLE',
  TOOL = 'TOOL',
  OTHER = 'OTHER',
}

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(MaterialCategory)
  category?: MaterialCategory;

  @IsOptional()
  @IsString()
  unit?: string;

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
