import { AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode, isAxiosError } from "axios";
import apiClient, { refreshToken } from './api-client';
import { redirect } from "react-router-dom";

export const refreshInterceptor = () => {
    return async (err: AxiosError) => {
        const original = err.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (err.response?.status === HttpStatusCode.Unauthorized && err.config?.url !== '/auth/refresh' && !original._retry) {
            original._retry = true;

            try {
                await refreshToken();
                return await apiClient.request(original);
            } catch (e) {
                if(isAxiosError(e) && e.status === HttpStatusCode.Unauthorized){
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken');
                    redirect("/signIn");
                }
                throw e;
            }
        }
    };
};