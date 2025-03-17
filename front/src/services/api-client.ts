import axios from "axios";
import { IUser } from "./user-service";
import { refreshInterceptor } from "./refreshInterceptors";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:3000'
    // baseURL: 'https://193.106.55.182',
});

export const refreshToken = async (): Promise<void> => {
    const newUser = (await axios.get('http://127.0.0.1:3000/auth/refresh', { 
        headers: {'authorization': `Bearer ${localStorage.getItem('refreshToken') }`}
    })).data;
    
    localStorage.setItem('refreshToken', newUser.refreshToken);
    localStorage.setItem('accessToken', newUser.accessToken);
};

apiClient.interceptors.request.use(
    (config) => {
      config.headers["authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    refreshInterceptor()
  );

export default apiClient;