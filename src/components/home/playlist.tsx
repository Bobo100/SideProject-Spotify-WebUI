import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./playList.module.scss";
import CommonContainer from "./common/commonContainer";
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterSearchType } from "@/utils/playerlistType";
import { useEffect, useState } from "react";

export default function PlayList() {
    const { theme } = useTheme();

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
        }
        getPlaylist()
    }, [])

    return (
        <CommonContainer topChildren={<div></div>} bottomChildren={<div></div>} />
    )
}