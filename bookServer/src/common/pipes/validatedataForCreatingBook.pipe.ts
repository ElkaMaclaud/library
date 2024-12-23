import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { CreateBookDto } from "src/book/dto/create.book.dto";

@Injectable()
export class ValidateDate implements PipeTransform<CreateBookDto> {
    async transform(value: CreateBookDto, metadata: ArgumentMetadata) {

        const val = value

        // if(val.authors && typeof val.authors === "string") {
        //     val.authors = val.authors.split(",")
        // }

        if(!val.title) {
            throw new BadRequestException("Not data")
        }

        return val
    }
}