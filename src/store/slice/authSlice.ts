import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../app/config";
import {RootState} from "../index";

interface AuthState {
    role: string | null;
    access: string | null;
    refresh: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    role: localStorage.getItem("userRole"),
    access: localStorage.getItem("accessToken"),
    refresh: localStorage.getItem("refreshToken"),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (
        credentials: { email: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            localStorage.setItem("userRole", response.data.role);
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Login failed");
            }
            return rejectWithValue("Login failed");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (
        userData: {
            roleUser: string;
            surname: string;
            firstName: string;
            middleName: string;
            email: string;
            password: string;
            phoneNumber: string;
        },
        {rejectWithValue}
    ) => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, userData);
            localStorage.setItem("userRole", response.data.roleUser);
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Registration failed");
            }
            return rejectWithValue("Registration failed");
        }
    }
);

export const refresh = createAsyncThunk(
    "auth/refresh",
    async (refreshToken: { refresh: string }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BASE_URL}/refresh`, refreshToken);
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Token refresh failed");
            }
            return rejectWithValue("Token refresh failed");
        }
    }
);
export const selectToken = (state: RootState) => {
    return state.auth.access;
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.role = null;
            state.access = null;
            state.refresh = null;
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.role = payload.role;
                state.access = payload.access;
                state.refresh = payload.refresh;
            })
            .addCase(login.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.role = payload.roleUser;
                state.access = payload.access;
                state.refresh = payload.refresh;
            })
            .addCase(register.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(refresh.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refresh.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.access = payload.access;
                state.refresh = payload.refresh;
            })
            .addCase(refresh.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            });
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;