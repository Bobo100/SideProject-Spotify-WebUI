import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./player.module.scss";
import { useEffect, useState, useCallback } from "react";
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterSearchType } from "@/utils/playerlistType";
import _throttle from "lodash/throttle";
import ListComponent from "./common/listComponent";
import CommonContainer from "./common/commonContainer";

export default function Player() {
    const { theme } = useTheme();
    const [query, setQuery] = useState([] as filterSearchType[]);

    const getQueue = async () => {
        const response = await httpsUtils.get({
            url: '/api/player/queue'
        });
        if (!response) return
        const result = processUtils.filterQueue(response)
        setQuery(result)
    }

    // 改成要一個計時，每幾秒去抓一次目前的歌曲資訊 但又要記得 一次只會跑一次 不要因為其他更新就又跑一次
    useEffect(() => {
        const asyncFunc = async () => {
            await getQueue();
        };

        asyncFunc();

        const timerId = setInterval(async () => {
            await getQueue();
        }, 5000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const bottomRender = useCallback(() => {
        return <ListComponent data={query} />
    }, [query])

    return (
        <CommonContainer topChildren={<div></div>} bottomChildren={bottomRender()} />
    )
}