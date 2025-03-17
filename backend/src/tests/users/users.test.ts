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
    uid = responseLogin.body.id;
});

afterAll(async () => {
    const user = await userSchema.findOne({ username: testUser.username });
    await user?.deleteOne();
    await mongoose.connection.close();
});

let accessToken: string;
let uid: string;

describe("Users controller tests", () => {
    test("Test getUserByID", async () => {
        const response = await request(app).get(`/users/${uid}`).set("Authorization", "Bearer " + accessToken).send();
        expect(response.statusCode).toBe(StatusCodes.OK);
    });

    test("Test updateUserByID", async () => {
        const changedUser = { firstName: 'Alorns' }
        const response = await request(app).put(`/users/${uid}`).set("Authorization", "Bearer " + accessToken).send(changedUser);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });
});
