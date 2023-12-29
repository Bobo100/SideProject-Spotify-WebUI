// ---------------------------------音樂---------------------------------
export interface MusicData {
    song_name: string;
    author: string[];
    album_image: string;
}

// export interface MusicDataArrayProps {
//     musicData: MusicData[];
// }

// 正在播放的歌曲
export interface listeningState {
    listeningList: string[];
    playingIndex?: number;
}

export const listeningInitialState: listeningState = {
    listeningList: [
        './music/example.mp3',
    ],
    playingIndex: 0
}
