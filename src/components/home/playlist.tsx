import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./playList.module.scss";
import CommonContainer from "./common/CommonContainer";
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterPlayListType } from "@/utils/playerlistType";
import { useEffect, useState } from "react";

export default function PlayList() {
    const { theme } = useTheme();
    const [playlist, setPlaylist] = useState([] as filterPlayListType[]);
    const [tracks, setTracks] = useState([] as any[]);

    useEffect(() => {
        const getPlaylist = async () => {
            const me = await httpsUtils.get({
                url: '/api/user/profile',
            });
            const response = await httpsUtils.post({
                url: '/api/playlist/playlists',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: me.id,
                }),
            });
            if (!response) return
            const playlist = response.items.slice(0, 5)
            const result = processUtils.filterPlaylist(playlist)
            setPlaylist(result)
        }
        getPlaylist()
    }, [])

    const handlePlaylistDetail = async (id: string) => {
        const response = await httpsUtils.post({
            url: '/api/playlist/tracks',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playlist_id: id,
            }),
        });
        if (!response) return
        // 因為我有在api tracks設定spotify回傳的格式 
        // 所以他們已經整理好了
        setTracks(response.items)
    }

    return (
        <CommonContainer topChildren={<div></div>}
            bottomChildren={
                <div>
                    {playlist.map((item, index) => {
                        return (
                            <div key={index} className={styles.playlist}>
                                <div className={styles.playlist__image}>
                                    {/* <img src={item.images} alt="" /> */}
                                </div>
                                <div className={styles.playlist__name} onClick={() => handlePlaylistDetail(item.id)}>
                                    {/* <a href={item.external_url} target="_blank">{item.name}</a> */}
                                    {item.name}
                                </div>
                            </div>
                        )
                    })}
                    <div>
                        {tracks.map((track, index) => {
                            return (
                                <div>
                                    {Object.values(track).map((item: any, index) => {
                                        return (
                                            <div key={index}>
                                                {item.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>}
        />
    )
}