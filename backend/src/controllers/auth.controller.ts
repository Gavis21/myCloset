import { Request, Response } from 'express';
import UserSchema from "../models/user";
import bcrypt from 'bcrypt';


const register = async (request: Request, response: Response) => {
    console.log(request.body)
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    const imageUrl = request.body.imageUrl;

    console.log(`${username} is trying to register with ${email}`);

    if (!username || !email || !password){
        console.error(`register failed because of missing parameters`);
        return response.status(400).send("Missing parameters");
    }

    console.log(`Checking if there is an existed user with ${username} and ${email}`);
    const existedUser = await UserSchema.findOne({
        $or: [
            {'username': username},
            {'email': email}
        ]
    });
    if (existedUser != null) {
        console.error(`Register failed for ${username} because username or email is already used`);
        return response.status(409).send("Username or email is already used");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    try {
        console.log(`Saving new user ${username} to the DB`);
        const user = await UserSchema.create({'username': username, 'password': encryptedPassword, 'email': email,
                                              'firstName' : request.body.firstName, 'lastName': request.body.lastName, 'imageUrl': imageUrl});
        return response.status(201).send(user);
    } catch (err) {
        console.error(`Error in creating new user - ${username}, \n ${err}`);
        response.status(500).send(`Error in creating new user - ${username}, \n ${err}`);
    }
}

export default {
    register,
}