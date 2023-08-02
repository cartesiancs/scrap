
import { createSlice } from '@reduxjs/toolkit'

type FeedObject = {
    idx: number
    content: string
    owner: string
    date: string
    type: number
}

type state = {
    feeds: FeedObject[]
}

const initialState: state = {
    feeds: [{idx: 0, content:'', owner: '', date: '', type: 0}]
}

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        push(state, action) {
            state.feeds.push(action.payload)
        },
        unshift(state, action) {
            state.feeds.unshift(action.payload)
        },
        remove(state, action) {
            const feedWithIdx = state.feeds.findIndex((obj) => obj.idx === action.payload.idx);
          
            if (feedWithIdx > -1) {
                state.feeds.splice(feedWithIdx, 1);
            }
        },
    }
})

export const { push, unshift, remove } = feedSlice.actions
export default feedSlice.reducer