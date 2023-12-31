// components/redux/store/store.tsx
import { configureStore } from '@reduxjs/toolkit'
import listeningSlice from '../slice/listeningSlice'
export const store = configureStore({
    reducer: {
        listening: listeningSlice
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //     serializableCheck: false
    // })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch