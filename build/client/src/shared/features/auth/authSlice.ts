import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localStorage

let user;
if(localStorage.getItem('user') === null){
    user = null;
}
else{
    user = JSON.parse(localStorage.getItem('user')!);
}

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isError: false,
    isSuccess: false, 
    message: ''
}

//Register user
export const register = createAsyncThunk('auth/signup', async (userData:any, thunkAPI) => {

    try{
        return await authService.register(userData);
        
    } catch (err:any) {
        const message = (
            err.response &&
            err.response.data &&
            err.response.data.message) ||
            err.message ||
            err.toString()
        return thunkAPI.rejectWithValue(message)
    }
});

export const login = createAsyncThunk('auth/login', async (userData:any, thunkAPI) => {
    try{
        return await authService.login(userData);
    } catch (err:any) {
        const message = (
            err.response &&
            err.response.data &&
            err.response.data.message) ||
            err.message ||
            err.toString()
        return thunkAPI.rejectWithValue(message)
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action:any) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload || action.message
                state.user = null
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(logout.rejected, (state, action:any) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload || action.error.message
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action:any) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload || action.message
                state.user = null
            })
    } 
});

export const {reset} = authSlice.actions;

export default authSlice.reducer;