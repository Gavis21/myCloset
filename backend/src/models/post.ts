import mongoose from "mongoose";

interface IComment {
    username: string,
    text: string
}

const commentSchema = new mongoose.Schema({
    username: String,
    text: String
});

export interface IPost {
    username: string,
    outfitName: string,
    imageUrl: string,
    description: string,
    comments: IComment[]
}

const postSchema = new mongoose.Schema<IPost>({
    username: {
        type: String,
        required: true,
    },
    outfitName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: {
        type: [commentSchema],
        required: true,
    },
});

export default mongoose.model<IPost>("Post", postSchema)