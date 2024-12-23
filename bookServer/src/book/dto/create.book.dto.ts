import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public readonly title: string;

    @IsString()
    @IsOptional()
    public readonly description?: string
    
    @IsArray()
    @IsString({ each: true }) 
    @IsOptional()
    public readonly authors?: string[];
    
    @IsString()
    @IsOptional()
    public readonly favorite?: string
    
    @IsString()
    @IsOptional()
    public readonly fileCover?: string
    
    @IsString()
    @IsOptional()
    public readonly fileName?: string
    
    @IsString()
    @IsOptional()
    public readonly fileBook?: string
}