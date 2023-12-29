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

    useEffect(() => {
        const getQueue = async () => {
            const response = await httpsUtils.get({
                url: '/api/player/queue'
            });
            if (!response) return
            const result = processUtils.filterQueue(response)
            setQuery(result)
        }
        getQueue()
    }, [])

    const bottomRender = useCallback(() => {
        return <ListComponent data={query} />
    }, [query])

    return (
        <CommonContainer topChildren={<div></div>} bottomChildren={bottomRender()} />
    )
}