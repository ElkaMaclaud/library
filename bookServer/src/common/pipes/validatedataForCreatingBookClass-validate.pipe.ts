import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { CreateBookDto } from "src/book/dto/create.book.dto";

@Injectable()
export class ValidateDate implements PipeTransform<CreateBookDto> {
    async transform(value: CreateBookDto, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
    }

    const

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}