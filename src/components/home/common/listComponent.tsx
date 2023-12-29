import ImageWrapper from "@/components/common/ImageWrapper/ImageWrapper";
import styles from "./listComponent.module.scss";
import { filterSearchType } from "@/utils/playerlistType";
import { getThemeClassName } from "@/utils/getThemeClassName";
import { useTheme } from "next-themes";
import { playerlistType } from '@/utils/playerlistType';
import _isEqual from 'lodash/isEqual';
import httpsUtils from "@/utils/httpsUtils";

type ListComponentProps = {
    data: filterSearchType[]
    viewType?: string
}

const ListComponent = ({ data, viewType }: ListComponentProps) => {
    const { theme } = useTheme();
    const handlePlay = async (uri: string) => {
        await httpsUtils.post({
            url: '/api/player/play',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uri
            })
        })
    }
    return data.map((item, index) => {
        return (
            <div key={`${item.name} ${index}`} className={styles.bottom_item_container}>
                <div className={styles.bottom_item}>
                    <div className={styles.bottom_item_index}>{index + 1}</div>
                    <div className={styles.bottom_item_image}>
                        <ImageWrapper src={item.images}
                            alt="album_image"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes='100vw'
                        />
                    </div>
                    <div className={styles.bottom_item_info}>
                        <div className={styles.bottom_item_songName}
                        >{item.name}</div>
                        <div className={styles.bottom_item_author}
                        >{item.author}</div>
                    </div>
                    {/* <div className={styles.bottom_item_albumName}>
                    </div> */}
                </div>
                {_isEqual(viewType, playerlistType.search) &&
                    <div className={styles.bottom_item_control}>
                        <button className={getThemeClassName("bottom_item_control_button", styles, theme)}
                            onClick={() => handlePlay(item.uri)}
                        >播放</button>
                        <button className={getThemeClassName("bottom_item_control_button", styles, theme)}>插歌</button>
                        <button className={getThemeClassName("bottom_item_control_button", styles, theme)}>加入</button>
                    </div>
                }
            </div>
        )
    })

}

export default ListComponent;