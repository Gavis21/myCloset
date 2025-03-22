import axios from "axios";
import { refreshInterceptor } from "./refreshInterceptors";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

export const refreshToken = async (): Promise<void> => {
    const newUser = (await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/refresh`, { 
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