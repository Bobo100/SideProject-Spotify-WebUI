import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./search.module.scss";
import ImageWrapper from "../common/ImageWrapper/ImageWrapper";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterSearchType } from "@/utils/playerlistType";
import _throttle from "lodash/throttle";

export default function SelectList() {
    const { theme } = useTheme();
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([] as filterSearchType[]);
    const [prevPageUrl, setPrevPageUrl] = useState("");
    const [nextPageUrl, setNextPageUrl] = useState("");

    useEffect(() => {
        // 設定一個throttle來限制使用者輸入的速度
        // 當使用者輸入後，會等待0.5秒才會執行handleSearch
        const throttleHandleSearch = _throttle(handleSearch, 500);
        if (searchValue) {
            throttleHandleSearch();
        }
    }, [searchValue]);

    console.log(searchResult)

    const handleSearch = async () => {
        const searchResult = await httpsUtils.get({
            url: `/api/search?keyWord=${searchValue}&offset=0`
        });
        const {
            result,
            prevUrl,
            nextUrl,
        } = await processUtils.filterSearch(searchResult);
        setSearchResult(result);
        setPrevPageUrl(prevUrl);
        setNextPageUrl(nextUrl);
    }

    // 寫一個共通的
    const searchFlow = async (url: string) => {
        const searchParams = new URLSearchParams(url);
        const query = searchParams.get('https://api.spotify.com/v1/search?query');
        const offset = searchParams.get('offset');
        const searchResult = await httpsUtils.get({
            url: `/api/search?keyWord=${query}&offset=${offset}`
        });
        const {
            result,
            prevUrl,
            nextUrl,
        } = await processUtils.filterSearch(searchResult);
        setSearchResult(result);
        setPrevPageUrl(prevUrl);
        setNextPageUrl(nextUrl);
    }


    return (
        <div className={getThemeClassName("searchList_container", styles, theme)}>
            <div className={getThemeClassName("searchList_top", styles, theme)}>
                <div className={getThemeClassName("searchList_top_search", styles, theme)}>
                    <FontAwesomeIcon icon={fas.faSearch}
                        className={styles.searchList_top_search_icon}
                    />
                    <input
                        className={getThemeClassName("searchList_top_search_input", styles, theme)}
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="你想要聽什麼歌呢"
                    />
                </div>
                <button
                    className={`${getThemeClassName("searchList_top_search_button", styles, theme)} ${!prevPageUrl && styles.disabled}`}
                    disabled={!prevPageUrl}
                    onClick={() => {
                        searchFlow(prevPageUrl);
                    }}
                >上一頁</button>
                <button className={`${getThemeClassName("searchList_top_search_button", styles, theme)}
                ${!nextPageUrl && styles.disabled}`}
                    disabled={!nextPageUrl}
                    onClick={() => {
                        searchFlow(nextPageUrl);
                    }}
                >下一頁</button>
            </div>
            <div className={getThemeClassName("searchList_bottom", styles, theme)}>
                {searchResult.map((item, index) => {
                    return (
                        <div key={`${item.name} ${index}`} className={styles.searchList_bottom_item}>
                            <div className={styles.searchList_bottom_item_index}>{index + 1}</div>
                            <div className={styles.searchList_bottom_item_image}>
                                <ImageWrapper src={item.images}
                                    alt="album_image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes='100vw'
                                />
                            </div>
                            <div className={styles.searchList_bottom_item_info}>
                                <div className={styles.searchList_bottom_item_songName}
                                >{item.name}</div>
                            </div>
                            <div className={styles.searchList_bottom_item_albumName}>
                            </div>
                        </div>
                    )
                })}
                {/* {favoriteList[Object.keys(favoriteList)[favoriteListIndex]].map((item, index) => {
                    return (
                        <div key={`${item.song_name} ${index}`} className={styles.searchList_bottom_item}>
                            <div className={styles.searchList_bottom_item_index}>{index + 1}</div>
                            <div className={styles.searchList_bottom_item_image}>
                                <ImageWrapper src={item.album_image}
                                    alt="album_image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes='100vw'
                                />
                            </div>
                            <div className={styles.searchList_bottom_item_info}>
                                <div className={styles.searchList_bottom_item_songName}
                                    onClick={() => {
                                        handleClick('song', -1, item.song_name)
                                    }}
                                >{item.song_name}</div>
                                <div className={styles.searchList_bottom_item_singer}>{item.singer.join(", ")}</div>
                            </div>
                            <div className={styles.searchList_bottom_item_albumName}>
                                {item.album_name}
                            </div>
                        </div>
                    )
                })} */}
            </div>
        </div >
    )
}