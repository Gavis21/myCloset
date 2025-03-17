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
});

afterAll(async () => {
    const user = await userSchema.findOne({ username: testUser.username });
    await user?.deleteOne();
    await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;

describe("Auth controller tests", () => {
    test("Test register", async () => {
        const response = await request(app).post("/auth/register").send(testUser);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });
    test("Test register with existing user", async () => {
        const response = await request(app).post("/auth/register").send(testUser);
        expect(response.statusCode).toBe(StatusCodes.CONFLICT);
    });
    test("Test login", async () => {
        const response = await request(app).post("/auth/login").send({
            email: "test@test.test",
            password: "123456"
        });
        expect(response.statusCode).toBe(StatusCodes.OK);

        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
    });

    test("Test access without token", async () => {
        const response = await request(app).get("/outfits/explore");
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("Test after timeout of JWT", async () => {
        await new Promise((resolve) => setTimeout(() => resolve(""), 5000));
    
        const response = await request(app)
          .get("/explore")
          .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).not.toBe(StatusCodes.OK);
    });

    test("Test refresh token", async () => {
        const loginResponse = await request(app).post("/auth/login").send(testUser);
        refreshToken = loginResponse.body.refreshToken;
    
        const response = await request(app)
          .get("/auth/refresh")
          .set("Authorization", "Bearer " + refreshToken)
          .send();
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    
        refreshToken = response.body.refreshToken;
      });

    test("Test logout", async () => {
        const response = await request(app)
          .get("/auth/logout")
          .set("Authorization", "Bearer " + refreshToken)
          .send();
    
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
});
