import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType>{
    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async getAll(req: Request, res: Response) {
        console.log(`Getting all - ${this.model.modelName}`);
        try {
            if (req.query.name) {
                const objects = await this.model.find({ name: req.query.name });
                res.send(objects);
            } else {
                const objects = await this.model.find();
                res.send(objects);
            }
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        console.log(`Getting - ${this.model.modelName} by ID - ${req.params.id}`);
        try {
            const object = await this.model.findById(req.params.id);
            res.send(object);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async create(req: Request, res: Response) {
        console.log(`Creating new - ${this.model.modelName}`);
        try {
            const object = await this.model.create(req.body);
            res.status(201).send(object);
        } catch (err: any) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;