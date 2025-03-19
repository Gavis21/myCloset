import { Comment } from "../Comments/commentType"

export type Post = {
    _id: string,
    username: string,
    outfitName: string,
    imageUrl: string,
    description: string,
    comments: Comment[]
}