import { createContext } from "react";

interface IAuthContext {
    user: string | null;
    setUser: (user: string | null) => void;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    setUser: () => {},
});

export default AuthContext;