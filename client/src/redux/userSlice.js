import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Instance } from '../App';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async(formData)=>{
        const request = await Instance.post("/auth/login",formData);
        const response = await request.data;
        console.log("res",response)
        localStorage.setItem("token", response.token);
        return response;
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async(formData)=>{
        const request = await Instance.post("/auth/register",formData);
        const response = await request.data;
        console.log("res",response)
        localStorage.setItem("token", response.token);
        return response;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState:{
        actions: 0,
        loading:false,
        user:null,
        error:null
    },
    reducers: {

        setRefetch: (state) => {
            state.actions++;
            state.isLoading = false
        },

    },

    extraReducers:(builder)=>{
        builder
            .addCase(loginUser.pending,(state)=>{
                state.loading=true;
                state.user=null;
                state.error=null;
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading=false;
                console.log(action.payload)
                state.user=action.payload;
                state.error=null;
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.loading=false;
                state.user=null;
                console.log(action.error.message);
                if(action.error.message){
                    state.error='Access denied! Invalid credentials';
                }
                else{
                    state.error= action.error.message;
                }
            })
            .addCase(registerUser.pending,(state)=>{
                state.loading=true;
                state.user=null;
                state.error=null;
            })
            .addCase(registerUser.fulfilled,(state,action)=>{
                state.loading=false;
                console.log(action.payload)
                state.user=action.payload;
                state.error=null;
            })
            .addCase(registerUser.rejected,(state,action)=>{
                state.loading=false;
                state.user=null;
                console.log(action.error.message);
                if(action.error.message){
                    state.error='Error creating account!';
                }
                else{
                    state.error= action.error.message;
                }
            })
    }
})
export const {  setRefetch } = userSlice.actions
export default userSlice.reducer;