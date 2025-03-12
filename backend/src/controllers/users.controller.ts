import UserSchema, { IUser } from "../models/user";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';


export class UserController extends BaseController<IUser>{
    constructor() {
        super(UserSchema);
    }

    async UpdateById(req: Request, res: Response) {
        const id = req.params.id;
        const changeUser = req.body as IUser;

        if(changeUser.username){
            const existed = await UserSchema.findOne({
                _id: { $ne: id },
                username: changeUser.username
            });

            if(existed) {
                throw new Error("Username already exist!");
            }
        }

        if (changeUser.password) {
            const salt = await bcrypt.genSalt(10);
            changeUser.password = await bcrypt.hash(changeUser.password, salt);
        }

        const updatedUser = await UserSchema.findByIdAndUpdate(id, changeUser, { new: true })

        if (!updatedUser) {
            throw new Error("Couldn't find requested user");
        }

        res.status(201).send();
    }
};