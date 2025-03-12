import { Express, response } from "express";
import initApp from '../../index';
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import userSchema, { IUser } from '../../models/user';
import postSchema, { IPost } from '../../models/post';


let app: Express;

const testUser = {
    email: "test@test.test",
    password: "123456",
    username: "testify",
    firstName: "testy",
    lastName: "test"
};

const testPost = {
    username: "testify",
    outfitName: "Guy-test",
    imageUrl: "../../public/1709988562601.png",
    description: "Olalalal",
}

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
    const post = await postSchema.findOne({_id: postId});
    await post?.deleteOne();
    await mongoose.connection.close();
});

let accessToken: string;
let postId: string;

describe("Posts controller tests", () => {
    test("Test getAll posts", async () => {
        const response = await request(app).get("/posts/").set("Authorization", "Bearer " + accessToken).send();
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
    test("Test create post", async () => {
        const response = await request(app).post("/posts/create").set("Authorization", "Bearer " + accessToken).send(testPost);
        postId = response.body._id;
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });
    test("Test get post by username", async () => {
        const respone = await request(app).get(`/posts/byUser/${testUser.username}`).set("Authorization", "Bearer " + accessToken).send();
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
    test("Test update posts", async () => {
        const response = await request(app).put(`/posts/${postId}`).set("Authorization", "Bearer " + accessToken).send({outfitName: 'UpdatedName'});
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
});
