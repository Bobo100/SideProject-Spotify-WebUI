// ---------------------------------音樂---------------------------------
export interface MusicData {
    song_name: string;
    singer: string[];
    singer_image: string[];
    song_url: string;
    album_image: string;
    album_name: string;
    created_at: string;
    favorite_list: string[];
    thoughts: string; // 這部分要想想
}

export interface MusicDataArrayProps {
    musicData: MusicData[];
}

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
