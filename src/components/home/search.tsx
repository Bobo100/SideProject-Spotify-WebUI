import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./search.module.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import httpsUtils from "@/utils/httpsUtils";
import processUtils from "@/utils/processUtils";
import { filterSearchType, playerlistType } from "@/utils/playerlistType";
import _throttle from "lodash/throttle";
import _get from "lodash/get";
import ListComponent from "./common/listComponent";
import CommonContainer from "./common/commonContainer";

export default function SelectList() {
    const { theme } = useTheme();
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([] as filterSearchType[]);
    const [prevPageUrl, setPrevPageUrl] = useState("");
    const [nextPageUrl, setNextPageUrl] = useState("");

    useEffect(() => {
        const throttleHandleSearch = _throttle(handleSearch, 500);
        if (searchValue) {
            throttleHandleSearch();
        }
    }, [searchValue]);

    const handleSearch = async () => {
        const searchResult = await httpsUtils.get({
            url: `/api/search?keyWord=${searchValue}&offset=0`
        });
        const errorStatus = _get(searchResult, "error.status");
        if (!errorStatus) {
            const {
                result,
                prevUrl,
                nextUrl,
            } = processUtils.filterSearch(searchResult);
            setSearchResult(result);
            setPrevPageUrl(prevUrl);
            setNextPageUrl(nextUrl);
        }
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
        } = processUtils.filterSearch(searchResult);
        setSearchResult(result);
        setPrevPageUrl(prevUrl);
        setNextPageUrl(nextUrl);
    }

    return (
        <CommonContainer topChildren={<>
            <div className={getThemeClassName("top_search", styles, theme)}>
                <FontAwesomeIcon icon={fas.faSearch}
                    className={styles.top_search_icon}
                />
                <input
                    className={getThemeClassName("top_search_input", styles, theme)}
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
                className={`${getThemeClassName("top_search_button", styles, theme)} ${!prevPageUrl && styles.disabled}`}
                disabled={!prevPageUrl}
                onClick={() => {
                    searchFlow(prevPageUrl);
                }}
            >上一頁</button>
            <button className={`${getThemeClassName("top_search_button", styles, theme)}
                 ${!nextPageUrl && styles.disabled}`}
                disabled={!nextPageUrl}
                onClick={() => {
                    searchFlow(nextPageUrl);
                }}
            >下一頁</button>
        </>} bottomChildren={<ListComponent data={searchResult} viewType={playerlistType.search} />
        } />
    )
}