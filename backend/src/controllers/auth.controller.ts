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

const logout = async (request: Request, response: Response) => {
    const header = request.headers['authorization'];
    const refreshToken = header && header.split(' ')[1]; // remove the Bearer

    if (refreshToken == null) { return response.sendStatus(401); }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err, logoutUser) => {
        console.log(`JWT verify - ${err}`);
        if (err) return response.sendStatus(401);

        try {
            console.log(`Fetching user with id ${(logoutUser as { '_id': string })._id} from the DB`);
            const user = await UserSchema.findOne({ '_id': (logoutUser as { '_id': string })._id });
            if (!user){
                console.error(`User ${(logoutUser as { '_id': string })._id} wasn't found`);
                response.sendStatus(404).send(`User wasn't found`);
            } else {
                if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)){
                    console.error(`No refresh token were found for ${(logoutUser as { '_id': string })._id}, reseting tokens...`);
                    user.refreshTokens = [];
                    await user.save();
                    return response.sendStatus(401);
                } else {
                    console.log(`Logout completed for ${(logoutUser as { '_id': string })._id}, removing current token...`)
                    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                    user.save();
                    return response.sendStatus(200);
                }
            }
        } catch (err) {
            console.error(`Error logout for - ${(logoutUser as { '_id': string })._id}, \n ${err}`);
            response.sendStatus(401).send(err);
        }    
    })
}

const refresh =  async (request: Request, response: Response) => {
    console.log('Refreshing token...');
    const header = request.headers['authorization'];
    const refreshToken = header && header.split(' ')[1]; // remove the Bearer

    if (refreshToken == null) { return response.sendStatus(401); }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err, logoutUser) => {
        console.log(`JWT verify - ${err}`);
        if (err) return response.sendStatus(401);

        try {
            console.log(`Fetching user with id ${(logoutUser as { '_id': string })._id} from the DB`);
            const user = await UserSchema.findOne({ '_id': (logoutUser as { '_id': string })._id });
            if (!user){
                console.error(`User ${(logoutUser as { '_id': string })._id} wasn't found`);
                response.sendStatus(404).send(`User wasn't found`);
            } else {
                if(!user.refreshTokens || user.refreshTokens.length === 0){
                    console.error(`No refresh token were found for ${(logoutUser as { '_id': string })._id}, reseting tokens...`);
                    user.refreshTokens = [];
                    await user.save();
                    return response.sendStatus(401);
                } else {
                    console.log(`Refresh completed for ${(logoutUser as { '_id': string })._id}, adding new token...`);

                    const accessToken = jwt.sign({ _id: user._id }, (process.env.JWT_SECRET as string), { expiresIn: process.env.JWT_EXPIRATION });
                    const newRefreshToken = jwt.sign({ _id: user._id }, (process.env.JWT_REFRESH_SECRET as string));
                    
                    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                    user.refreshTokens.push(newRefreshToken);

                    await user.save();
                    return response.status(200).send({
                        'accessToken': accessToken,
                        'refreshToken': refreshToken
                    });
                }
            }
        } catch (err) {
            console.error(`Error logout for - ${(logoutUser as { '_id': string })._id}, \n ${err}`);
            response.sendStatus(401).send(err);
        }    
    })
}


const loginWithGoogle = () => {
    return async (request: Request, response: Response) => {
        try {
            const oauth2Client = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                "postmessage"
              );
            const code = request.body.code;
            const token = await oauth2Client.getToken(code);
            const loginTicket = await oauth2Client.verifyIdToken({
                idToken: token.tokens.id_token ?? "",
            });

            const payload = loginTicket.getPayload();
            let user = await UserSchema.findOne({ email: payload?.email });

            if(user === null){
                user = await UserSchema.create({
                    email: payload?.email,
                    firstName: payload?.name?.split(" ")[0],
                    lastName: payload?.name?.split(" ")[1],
                    profilePic: payload?.picture,
                    username: payload?.email,
                    isGoogleUser: true,
                });
            } else if (!user.isGoogleUser) {
                throw new Error("Email is already used with password");
            }

            const accessToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET as string);

            if (!user.refreshTokens) {
                user.refreshTokens = [refreshToken];
            } else {
                user.refreshTokens.push(refreshToken);
            }

            await user.save();

            console.log('Logged with Google!');

            return response.status(200).send({
                        'id': user._id,
                        'username': user.username,
                        'accessToken': accessToken,
                        'refreshToken': refreshToken
                    });
        } catch (err) {
            console.log(err);
        }
    };
}


export default {
    register,
    login,
    logout,
    refresh,
    loginWithGoogle
}