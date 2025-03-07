import { Request, Response } from 'express';
import UserSchema from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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


const login = async (request: Request, response: Response) => {
    const email = request.body.email;
    const password = request.body.password;

    console.log(`${email} is trying to login`)

    if (!email || !password){
        console.error(`Login failed because of missing parameters`);
        return response.status(400).send("Missing parameters");
    }

    console.log(`Fetching user with email ${email}`)
    const user = await UserSchema.findOne({'email': email});
    if (user == null) {
        console.error(`User for ${email} doesn't exists`);
        return response.status(404).send("User for that email doesn't exists");
    } 

    const isPasswdsMatches = await bcrypt.compare(password, user.password);
    if (!isPasswdsMatches){
        console.error(`Passwords for ${email} doesn't match - login failed`);
        return response.status(401).send("Wrong email or password");
    }

    const accessToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET as string);
    if (!user.refreshTokens) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }
    
    try {
        console.log(`Login completed for ${user._id}`);
        await user.save();

        return response.status(200).send({
            'id': user._id,
            'username': user.username,
            'accessToken': accessToken,
            'refreshToken': refreshToken
        });
    } catch (err) {
        console.error(`Error login for - ${user._id}, \n ${err}`);
        response.status(500).send(`Error login for - ${user._id}, \n ${err}`);
    }
}

export default {
    register,
    login
}