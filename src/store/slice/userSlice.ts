import axios from "axios";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import BASE_URL from "../../app/config";
import {RootState} from "../index";
import {logout} from "./authSlice";
type UserState ={
    name: string;
}

const initialState: UserState ={
    name : ''
}


export const test = createAsyncThunk(
    "user/test",
    async(
        _,
        thunkApi
    ) =>{
        const {rejectWithValue,getState, dispatch} = thunkApi
        try{
            const config = {headers:{"Authorization": `Bearer ${(getState() as RootState).auth.access}`}}
            const response = await axios.get(`${BASE_URL}/test`,config);
            if(response.status === 401){
                dispatch(logout())
                return rejectWithValue("token expired");
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Login failed");
            }
            return rejectWithValue("Login failed");
        }

    }

)
// export const setImage = createAsyncThunk<{id:string},{formData:FormData}>(
//     "user/setImage",
//     async(
//         data,
//         thunkApi
//     ) =>{
//         const {rejectWithValue,getState, dispatch} = thunkApi
//         try{
//             const config = {headers:{"Content-Type": 'multipart/form-data'}}
//             const response = await api.post('/profile/image',data.formData, config );
//             if(response.status === 401){
//                 dispatch(logout())
//                 return rejectWithValue("token expired");
//             }
//             return response.data;
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 return rejectWithValue(error.response?.data || "Login failed");
//             }
//             return rejectWithValue("Login failed");
//         }
//
//     }
//
// )


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    },

});
export default userSlice.reducer;
