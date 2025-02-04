import axios from "axios";
import store from "../store";
import { refresh, logout } from "../store/slice/authSlice";
import BASE_URL from "./config";

const api = axios.create({
    baseURL: BASE_URL,
});


// добавляет access token в заголовок запроса
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken =
            state.auth.access || localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// прокидывает запрос или логаутит
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401) {
            try {
                const state = store.getState();
                const refreshToken =
                    state.auth.refresh || localStorage.getItem("refreshToken");
                if (refreshToken) {
                    console.log('666')
                    const response = await store.dispatch(
                        refresh({ refresh: refreshToken })
                    );
                    const { access } = response.payload;
                    localStorage.setItem("accessToken", access);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
                    originalRequest.headers["Authorization"] = `Bearer ${access}`;
                    return axios(originalRequest);
                }else{
                    throw new Error("no tokem111")
                }
            } catch (err) {
                console.log('cgvhbjj')
                store.dispatch(logout());
                window.location.pathname = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
export default api;