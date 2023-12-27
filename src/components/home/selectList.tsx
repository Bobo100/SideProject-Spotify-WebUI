import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./selectList.module.scss";
import ImageWrapper from "../common/ImageWrapper/ImageWrapper";

export default function SelectList() {
    const { theme } = useTheme();
    return (
        <div className={getThemeClassName("favoriteListInfo_container", styles, theme)}>
            <div className={getThemeClassName("favoriteListInfo_top", styles, theme)}>
                <h1>歌單內容</h1>
            </div>
            <div className={getThemeClassName("favoriteListInfo_bottom", styles, theme)}>
                {/* {favoriteList[Object.keys(favoriteList)[favoriteListIndex]].map((item, index) => {
                    return (
                        <div key={`${item.song_name} ${index}`} className={styles.favoriteListInfo_bottom_item}>
                            <div className={styles.favoriteListInfo_bottom_item_index}>{index + 1}</div>
                            <div className={styles.favoriteListInfo_bottom_item_image}>
                                <ImageWrapper src={item.album_image}
                                    alt="album_image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes='100vw'
                                />
                            </div>
                            <div className={styles.favoriteListInfo_bottom_item_info}>
                                <div className={styles.favoriteListInfo_bottom_item_songName}
                                    onClick={() => {
                                        handleClick('song', -1, item.song_name)
                                    }}
                                >{item.song_name}</div>
                                <div className={styles.favoriteListInfo_bottom_item_singer}>{item.singer.join(", ")}</div>
                            </div>
                            <div className={styles.favoriteListInfo_bottom_item_albumName}>
                                {item.album_name}
                            </div>
                        </div>
                    )
                })} */}
            </div>
        </div>
    )
}