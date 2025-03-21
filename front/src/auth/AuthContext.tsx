import { createContext } from "react";
import { IUser } from "../services/user-service";

interface IAuthContext {
    user: IUser | undefined;
    setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<IAuthContext>({
    user: {},
    setUser: () => {},
});

export default AuthContext;