export interface AsyncState {
    userId: number
    id: number
    title: string
    completed: boolean
    isLoading: boolean
}

export const asyncInitialState: AsyncState = {
    userId: 0,
    id: 0,
    title: '',
    completed: true,
    isLoading: false
}