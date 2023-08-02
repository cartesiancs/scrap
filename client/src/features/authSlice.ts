
import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

type state = {
    isLogin: boolean
    userId: string
}

const checkLogin = () => {
    let token = Cookies.get("user")
    try {
        let decoded = JSON.parse(atob(token.split('.')[1]));
        return {
            isVaild: 1,
            decoded: decoded
        }
    } catch (error) {
        return {
            isVaild: 0
        }
    }
}

let loginStatus = checkLogin()


const initialState: state = {
    isLogin: loginStatus.isVaild == 1 ? true : false,
    userId: loginStatus.isVaild == 1 ? loginStatus.decoded.user_id : ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeIsLogin(state, action) {
            state.isLogin = action.payload.isLogin
        },
        updateUserId(state, action) {
            state.userId = action.payload.userId
        }
    }
})

export const { changeIsLogin, updateUserId } = authSlice.actions
export default authSlice.reducer