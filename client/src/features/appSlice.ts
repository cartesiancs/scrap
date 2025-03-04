
import { createSlice } from '@reduxjs/toolkit'
import { LocalStorage } from '../utils/localStorage'

type state = {
    isDarkmode: boolean
}

const initialDarkmode = (): boolean => {
    const ls = new LocalStorage()
    const isExist = ls.exist('darkmode')

    if (isExist) {
        return ls.get('darkmode') == 'true' ? true : false
    }

    ls.set('darkmode', 'false')
    return false
}

const applyBackgroundColor = () => {
    const isDarkmode = initialDarkmode()
    document.body.style.background = isDarkmode ? "#121212" : "rgba(255,255,255,1)"
}

const initialState: state = {
    isDarkmode: initialDarkmode(),
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleDarkmode(state, action) {
            const ls = new LocalStorage()
            ls.set('darkmode', action.payload.isDarkmode)
            state.isDarkmode = action.payload.isDarkmode
            applyBackgroundColor()
        }
    }
})

export const { toggleDarkmode } = appSlice.actions
export default appSlice.reducer