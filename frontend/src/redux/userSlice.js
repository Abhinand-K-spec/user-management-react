import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: null,
        email: null,
        role: 'user',
        auth: false,
        id: null,
        lastname: null,
        token: null
    },
    reducers: {
        loggin: (state, action) => {
            state.username = action.payload.user.name
            state.email = action.payload.user.email
            state.role = action.payload.user.role
            state.id = action.payload.user._id
            state.auth = true
            state.lastname = action.payload.user.lastname
            state.token = action.payload.token
        },
        logout: (state) => {
            state.username = null
            state.email = null
            state.auth = false
            state.id = null
            state.lastname = null
            state.token = null
            state.role = 'user'
        }
    }
});


export const { loggin, logout } = userSlice.actions;
export default userSlice.reducer;