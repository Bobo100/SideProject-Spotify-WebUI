// https://dev.to/documatic/building-a-music-player-in-react-2aa4 可以參考這個來寫
import styles from './homeComponent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useRef, useState } from 'react';
import { MusicData, listeningState } from '../redux/state/stateType';
import { getThemeClassName } from '@/utils/getThemeClassName';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '../redux/hook/hook';
import { clickFavoriteList, getPlayingData, setPlayingIndex } from '../redux/slice/listeningSlice';
import { playerlistType } from '@/utils/playerlistType';
import _isEqual from 'lodash/isEqual';
import Search from './search';
import PlayerList from './player';
import SelectList from './playlist';
import Link from 'next/link';
import httpsUtils from '@/utils/httpsUtils';
import ImageWrapper from '../common/ImageWrapper/ImageWrapper';
export default function HomeComponent() {

    const { theme } = useTheme();
    const [view, setView] = useState(playerlistType.playlist);
    const [mute, setMute] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<MusicData>();
    const [volume, setVolume] = useState(0);

    const getCurrentSongInfo = async () => {
        const response = await httpsUtils.post({
            url: '/api/player/current',
        });
        if (!response) return null;

        return {
            song_name: response.item.name,
            author: response.item.album.artists.map((item: any) => item.name),
            album_image: response.item.album.images[0].url,
        };
    };

    // 改成要一個計時，每幾秒去抓一次目前的歌曲資訊 但又要記得 一次只會跑一次 不要因為其他更新就又跑一次
    useEffect(() => {
        const asyncFunc = async () => {
            const info = await getCurrentSongInfo();
            if (info) {
                setCurrentInfo(info);
            }
        };

        asyncFunc();

        const timerId = setInterval(async () => {
            const info = await getCurrentSongInfo();
            if (info) {
                setCurrentInfo(info);
            }
        }, 5000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const handleSetView = (view: string) => {
        setView(view);
    }

    const handlePlayPause = () => {
        setPlaying(!playing);
    }

    const handleMute = () => {
        setMute(!mute);
    }

    //     curl --request PUT \
    //   --url 'https://api.spotify.com/v1/me/player/volume?volume_percent=50' \
    //   --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'

    const handleVolume = async (volume: number) => {
        await httpsUtils.post({
            url: '/api/player/volume',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                volume
            })
        })
        setVolume(volume);
    }

    return (
        <div className={styles.container}>
            <div className={styles.musicMain_container}>
                {/* 左邊區域 音樂清單 */}
                <div className={`${getThemeClassName("musicList_container", styles, theme)}`}>
                    <h1>功能列表</h1>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.search)}>搜尋Search</div>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.player)}>當前Queue</div>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.playlist)}>歌單！！</div>
                </div>
                {/* 右邊區域 歌單 / 歌曲 / 歌手 */}
                {_isEqual(view, playerlistType.search) && <Search />}
                {_isEqual(view, playerlistType.player) && <PlayerList />}
                {_isEqual(view, playerlistType.playlist) && <SelectList />}
            </div>
            {/* 最下方 音樂播放器 */}
            <div className={getThemeClassName("musicPlayer_container", styles)}>
                <div className={styles.musicPlayer}>
                    <div className={styles.musicPlayer_left}>
                        {currentInfo?.album_image &&
                            <div className={styles.musicPlayer_image}>
                                <ImageWrapper
                                    src={currentInfo?.album_image} alt="album_image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes='100vw'
                                />
                            </div>
                        }
                        <div>
                        </div>
                        <div>
                            <div>{currentInfo?.song_name}</div>
                            <div>{currentInfo?.author}</div>
                        </div>
                        <FontAwesomeIcon icon={fas.faHeart} />
                    </div>

                    <div className={styles.musicPlayer_center}>
                        <div className={styles.musicPlayer_center_top}>
                            <FontAwesomeIcon icon={fas.faShuffle} />
                            <FontAwesomeIcon icon={fas.faBackward} />
                            {playing ? <FontAwesomeIcon icon={fas.faPause} onClick={handlePlayPause} /> : <FontAwesomeIcon icon={fas.faPlay} onClick={handlePlayPause} />}
                            <FontAwesomeIcon icon={fas.faForward} />
                            <FontAwesomeIcon icon={fas.faRedo} />
                        </div>
                        <div className={styles.musicPlayer_center_bottom}>
                            <div className={styles.musicPlayer_center_container}>
                                {/* <audio ref={audioRef} src={playingList.listeningList[playingList.playingIndex ? playingList.playingIndex : 0]} onTimeUpdate={handleTimeUpdate}
                                />
                                <input type="range" min="0" max={Math.ceil(audioRef.current?.duration as number ? audioRef.current?.duration as number : 0)}
                                    value={currentTime}
                                    className={getThemeClassName("progressBar", styles, theme)}
                                    title="Seek to a position in the audio"
                                    ref={progressBarRef}
                                    onChange={(e) => {
                                        setCurrentTime(e.target.value);
                                        if (audioRef.current)
                                            audioRef.current.currentTime = e.target.value as unknown as number;
                                    }}
                                /> */}
                            </div>
                        </div>
                    </div>

                    <div className={styles.musicPlayer_right}>
                        <FontAwesomeIcon icon={fas.faMusic} />
                        <FontAwesomeIcon icon={fas.faBars} />
                        {mute ?
                            <FontAwesomeIcon icon={fas.faVolumeMute}
                            />
                            :
                            <FontAwesomeIcon icon={fas.faVolumeUp} />
                        }
                        <input type="range" min="0" max="100"
                            value={volume}
                            className={getThemeClassName("volumeBar", styles, theme)}
                            title="Volume"
                            onChange={(e) => {
                                handleVolume(parseInt(e.target.value));
                            }}
                        />
                    </div>
                </div>
            </div>

        </div >
    )
}