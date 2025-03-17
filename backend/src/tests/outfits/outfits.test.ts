import { Express } from "express";
import initApp from '../../index';
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import userSchema, { IUser } from '../../models/user';

let app: Express;

let testUser = {
    email: "test@test.test",
    password: "123456",
    username: "testify",
    firstName: "testy",
    lastName: "test"
};

beforeAll(async () => {
    app = await initApp();
    const responseRegister = await request(app).post("/auth/register").send(testUser);
    const responseLogin = await request(app).post("/auth/login").send({
        email: "test@test.test",
        password: "123456"
    });
    accessToken = responseLogin.body.accessToken;
});

afterAll(async () => {
    const user = await userSchema.findOne({ username: testUser.username });
    await user?.deleteOne();
    await mongoose.connection.close();
});

let accessToken: string;

describe("Outfits controller tests", () => {
    test("Test explore", async () => {
        const response = await request(app).get("/outfits/explore").set("Authorization", "Bearer " + accessToken).send();
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
});
