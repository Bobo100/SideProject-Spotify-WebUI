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
import Search from './Search';
import PlayerList from './Player';
import SelectList from './Playlist';
import Link from 'next/link';
import httpsUtils from '@/utils/httpsUtils';
import ImageWrapper from '../common/ImageWrapper/ImageWrapper';
import _throttle from 'lodash/throttle';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _ from 'lodash';

export default function HomeComponent() {

    const { theme } = useTheme();
    const [view, setView] = useState(playerlistType.playlist);
    const [mute, setMute] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<MusicData>();
    const [activeDevice, setActiveDevice] = useState(null);
    const [volume, setVolume] = useState<number>(50);
    const [duration, setDuration] = useState<number>(0);
    const [progressPercent, setProgressPercent] = useState<number>(0);

    const getCurrentSongInfo = async () => {
        const response = await httpsUtils.get({
            url: '/api/player/current',
        });
        const errorStatus = _get(response, "error.status");
        if (!errorStatus) {
            setCurrentInfo({
                song_name: response.item.name,
                author: response.item.album.artists.map((item: any) => item.name),
                album_image: response.item.album.images[0].url,
            });
            if (!_isEqual(response.item.duration_ms, duration)) {
                setDuration(response.item.duration_ms);
            }
            const percent = Math.floor(response.progress_ms / response.item.duration_ms * 100);
            if (!_isEqual(percent, progressPercent)) {
                setProgressPercent(percent);
            }
            if (!_isEqual(response.is_playing, playing)) {
                setPlaying(response.is_playing);
            }
        };
    }

    // 改成要一個計時，每幾秒去抓一次目前的歌曲資訊 但又要記得 一次只會跑一次 不要因為其他更新就又跑一次
    useEffect(() => {
        const asyncFunc = async () => {
            await getCurrentSongInfo();
        };

        asyncFunc();

        const timerId = setInterval(async () => {
            await getCurrentSongInfo();
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    useEffect(() => {
        const getActiveDevice = async () => {
            const response = await httpsUtils.post({
                url: '/api/player/devices',
            });
            const errorStatus = _get(response, "error.status");
            if (errorStatus) {
                return null;
            } else {
                const activeDevice = response.devices.find((item: any) => item.is_active);
                if (!_isEmpty(activeDevice)) {
                    setActiveDevice(activeDevice.id)
                }
            }
        };
        getActiveDevice();
    }, []);

    const handleSetView = (view: string) => {
        setView(view);
    }

    const handleBackward = async () => {
        await httpsUtils.post({
            url: '/api/player/skipPrev',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activeDeviceId: activeDevice,
            })
        })
        await getCurrentSongInfo();
    }

    const handleForward = async () => {
        await httpsUtils.post({
            url: '/api/player/skipNext',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activeDeviceId: activeDevice,
            })
        })
        await getCurrentSongInfo();
    }

    // const checkPlaying = async () => {
    //     if (_isEqual(playing, false)) {
    //         console.log('暫停中');
    //     } else {
    //         console.log('播放中');
    //     }
    // }

    // useEffect(() => {
    //     checkPlaying();
    // }, [playing]);

    const handlePlayPause = () => {
        if (playing) {
            handleThrottlePlay(false);
            setPlaying(false);
        } else {
            handleThrottlePlay(true);
            setPlaying(true);
        }
    }

    const handleThrottlePlay = _throttle(async (play: boolean) => {
        if (play) {
            await httpsUtils.post({
                url: '/api/player/resume',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activeDeviceId: activeDevice,
                })
            })

        } else {
            await httpsUtils.post({
                url: '/api/player/pause',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activeDeviceId: activeDevice,
                })
            })
        }
    }, 1000, { leading: true, trailing: false });

    const handleMute = () => {
        if (mute) {
            handleThrottleVolume(50);
            setVolume(50);
            setMute(false);
        } else {
            handleThrottleVolume(0);
            setVolume(0);
            setMute(true);
        }
    }

    const handleThrottleVolume = _throttle(async (volume: number) => {
        await httpsUtils.post({
            url: '/api/player/volume',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activeDeviceId: activeDevice,
                volume
            })
        })
    }, 1000, { leading: true, trailing: false });

    const handleTimeUpdate = async (percent: number) => {
        const position_ms = Math.floor(percent * duration / 100);
        await httpsUtils.post({
            url: '/api/player/seek',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activeDeviceId: activeDevice,
                position_ms: position_ms
            })
        });
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
                            <FontAwesomeIcon icon={fas.faBackward} onClick={handleBackward} />
                            {playing ? <FontAwesomeIcon icon={fas.faPause} onClick={handlePlayPause} /> : <FontAwesomeIcon icon={fas.faPlay} onClick={handlePlayPause} />}
                            <FontAwesomeIcon icon={fas.faForward} onClick={handleForward} />
                            <FontAwesomeIcon icon={fas.faRedo} />
                        </div>
                        <div className={styles.musicPlayer_center_bottom}>
                            <div className={styles.musicPlayer_center_container}>
                                <input type="range" min="0" max={100}
                                    value={progressPercent}
                                    className={getThemeClassName("progressBar", styles, theme)}
                                    title="Seek to a position in the audio"
                                    onChange={(e) => {
                                        setProgressPercent(e.target.value as unknown as number);
                                        handleTimeUpdate(e.target.value as unknown as number);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.musicPlayer_right}>
                        <FontAwesomeIcon icon={fas.faMusic} />
                        <FontAwesomeIcon icon={fas.faBars} />
                        {mute ?
                            <FontAwesomeIcon icon={fas.faVolumeMute} onClick={handleMute} />
                            :
                            <FontAwesomeIcon icon={fas.faVolumeUp} onClick={handleMute} />
                        }
                        <input type="range" min="0" max="100"
                            value={volume}
                            className={`${getThemeClassName("volumeBar", styles, theme)} ${_isNil(activeDevice) ? styles.volumeBar_disable : ""}`}
                            title="Volume"
                            onChange={(e) => {
                                setVolume(e.target.value as unknown as number);
                                handleThrottleVolume(e.target.value as unknown as number);
                            }}
                        />
                    </div>
                </div>
            </div>

        </div >
    )
}