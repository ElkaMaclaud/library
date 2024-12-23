import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateBookDto } from "src/book/dto/create.book.dto";

@Injectable()
export class ValidateCreateDate implements PipeTransform<CreateBookDto> {
    async transform(value: CreateBookDto, { metatype }: ArgumentMetadata) {
        console.log("ValidateCreateDate...")
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)
        if(errors.length) {
            throw new BadRequestException('Validate failed')
        }
        return value
    }
    
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}