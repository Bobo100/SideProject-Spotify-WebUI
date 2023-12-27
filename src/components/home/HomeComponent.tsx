// https://dev.to/documatic/building-a-music-player-in-react-2aa4 可以參考這個來寫
import styles from './homeComponent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useRef, useState } from 'react';
import { MusicData, listeningState } from '../redux/state/stateType';
import { getThemeClassName } from '@/utils/getThemeClassName';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '../redux/hook/hook';
import { clickFavoriteList, getPlayingData, setPlayingIndex } from '../redux/slice/listeningSlice';
import { playerlistType } from '@/utils/playerlistType';
import _isEqual from 'lodash/isEqual';
import Search from './search';
import PlayerList from './player';
import SelectList from './selectList';
export default function HomeComponent() {

    const { theme } = useTheme();
    const [view, setView] = useState(playerlistType.playlist);

    const handleSetView = (view: string) => {
        setView(view);
    }

    return (
        <div className={styles.container}>
            <div className={styles.musicMain_container}>
                {/* 左邊區域 音樂清單 */}
                <div className={`${getThemeClassName("musicList_container", styles, theme)}`}>
                    <h1>功能列表</h1>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.search)}>搜尋Search</div>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.player)}>當前播放清單</div>
                    <div className={getThemeClassName("musicList_item", styles, theme)} onClick={() => handleSetView(playerlistType.playlist)}>當前歌單</div>
                </div>
                {/* 右邊區域 歌單 / 歌曲 / 歌手 */}
                {_isEqual(view, playerlistType.search) && <Search />}
                {_isEqual(view, playerlistType.playlist) && <PlayerList />}
                {_isEqual(view, playerlistType.playlist) && <SelectList />}
            </div>
            {/* 最下方 音樂播放器 */}
            <div className={getThemeClassName("musicPlayer_container", styles)}>
                <div className={styles.musicPlayer}>
                    <div className={styles.musicPlayer_left}>
                        <div>圖片</div>
                        <div>
                            <div>歌曲名字</div>
                            <div>歌手名字</div>
                        </div>
                        <FontAwesomeIcon icon={fas.faHeart} />
                    </div>

                    <div className={styles.musicPlayer_center}>
                        <div className={styles.musicPlayer_center_top}>
                            <FontAwesomeIcon icon={fas.faShuffle} />
                            <FontAwesomeIcon icon={fas.faBackward} />
                            {/* {isPlaying ? <FontAwesomeIcon icon={fas.faPause} onClick={handlePlayPause} /> : <FontAwesomeIcon icon={fas.faPlay} onClick={handlePlayPause} />} */}
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
                        {/* {isMute ?
                            <FontAwesomeIcon icon={fas.faVolumeMute} onClick={() => {
                                setVolume(lastVolume);
                                setIsMute(false)
                                if (audioRef.current) {
                                    audioRef.current.volume = lastVolume as unknown as number / 100;
                                }
                            }}
                            />
                            :
                            <FontAwesomeIcon icon={fas.faVolumeUp} onClick={() => {
                                setLastVolume(volume);
                                setVolume("0");
                                setIsMute(true)
                                if (audioRef.current) {
                                    audioRef.current.volume = 0;
                                }
                            }} />
                        } */}
                        <input type="range" min="0" max="100"
                            // value={volume}
                            className={getThemeClassName("volumeBar", styles, theme)}
                            title="Volume"
                        // onChange={(e) => {
                        //     setVolume(e.target.value);
                        //     if (e.target.value === "0") {
                        //         setIsMute(true);
                        //         if (audioRef.current) {
                        //             audioRef.current.volume = 0;
                        //         }
                        //     }
                        //     else {
                        //         setIsMute(false);
                        //         if (audioRef.current) {
                        //             audioRef.current.volume = e.target.value as unknown as number / 100;
                        //         }
                        //     }
                        // }}
                        />
                    </div>
                </div>
            </div>

        </div >
    )
}