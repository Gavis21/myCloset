import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

export interface IUser {
    email: string;
    password: string;
    username: string;
    profile?: string;
    firstName: string;
    lastName: string;
    refreshTokens?: string[];
    isGoogleUser?: boolean;
    imageUrl?: string
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    profile: {
        type: String,
    },
    refreshTokens: {
        type: [String],
        required: false,
    },
    isGoogleUser: {
        type: Boolean,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false
    }
});

export default mongoose.model<IUser>("User", userSchema)