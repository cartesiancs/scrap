
import { createSlice } from '@reduxjs/toolkit'

type FeedObject = {
    idx: number
    thought: string,
    quotationText: string,
    quotationOrigin: string,
    owner: string
    date: string
    type: number
}

type state = {
    feeds: FeedObject[]
}

const initialState: state = {
    feeds: [{idx: 0, thought:'', quotationText:'', quotationOrigin:'', owner: '', date: '', type: 0}]
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
        clear(state, action) {
            state.feeds = [{idx: 0, thought:'', quotationText:'', quotationOrigin:'', owner: '', date: '', type: 0}]
        },
        remove(state, action) {
            const feedWithIdx = state.feeds.findIndex((obj) => obj.idx === action.payload.idx);
          
            if (feedWithIdx > -1) {
                state.feeds.splice(feedWithIdx, 1);
            }
        },
    }
})

export const { push, unshift, remove, clear } = feedSlice.actions
export default feedSlice.reducer