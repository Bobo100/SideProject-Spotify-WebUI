import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./player.module.scss";
import ImageWrapper from "../common/ImageWrapper/ImageWrapper";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterSearchType } from "@/utils/playerlistType";
import _throttle from "lodash/throttle";

export default function PlayerList() {
    const { theme } = useTheme();
   
    return (
        <div className={getThemeClassName("playerList_container", styles, theme)}>
            <div className={getThemeClassName("playerList_top", styles, theme)}>
                <div className={getThemeClassName("playerList_top_search", styles, theme)}>                   
                    
                </div>
                
            </div>
            <div className={getThemeClassName("playerList_bottom", styles, theme)}>                
               
            </div>
        </div >
    )
}