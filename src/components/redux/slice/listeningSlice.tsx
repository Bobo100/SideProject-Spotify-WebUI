// src/redux/listeningSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { listeningInitialState, listeningState } from '../state/stateType';

const listeningSlice = createSlice({
    name: 'listening',
    initialState: listeningInitialState,
    reducers: {
        // 點選喜愛清單的播放按鈕 會將播放清單改為喜愛清單的歌曲
        clickFavoriteList(state, action: PayloadAction<listeningState>) {
            state.listeningList = action.payload.listeningList;
        },
        // 當播放到下一首或是上一首時，會改變播放清單的index
        // 目的是當使用者點選下一首或是上一首時，會改變播放清單的index        
        setPlayingIndex(state, action: PayloadAction<number>) {
            state.playingIndex = action.payload;
        }
    },
});


export const { clickFavoriteList, setPlayingIndex } = listeningSlice.actions;
export const getPlayingData = (state: RootState) => state.listening;
export default listeningSlice.reducer;
