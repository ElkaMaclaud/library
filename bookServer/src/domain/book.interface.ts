import { Types } from "mongoose"

export interface BookInterface {
    _id: Types.ObjectId,
    title: string,
    description: string,
    authors: string[],
    favorite?: string,
    fileCover?: string,
    fileName?: string,
    fileBook: string,
    __v: number
}