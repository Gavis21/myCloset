import apiClient from "./api-client"

export interface IUser {
    _id?: string,
    email?: string,
    password?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    accessToken?: string,
    refreshToken?: string,
    isGoogleUser?: boolean,
    imageUrl?: string
}

export const register = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log(`Registering user - ${user.email}`);
        apiClient.post("/auth/register", user).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    });
}

export const login = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log(`Loging user - ${user.email}`);
        apiClient.post("/auth/login", user).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    });
}

export const getAllUsers = () => {
    const abortController = new AbortController()
    const req = apiClient.get<IUser[]>('users', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }
}
export const getUserById = (userId: String) => {
    return new Promise<IUser>((resolve, reject) => {
        apiClient.get(`/users/${userId}`).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    });
}

export const updateById = (userId: String, updatedUser: IUser) => {
    return new Promise<void>((resolve, reject) => {
        apiClient.put(`/users/${userId}`, updatedUser).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    });
}
