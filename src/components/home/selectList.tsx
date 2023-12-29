import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./selectList.module.scss";
import ImageWrapper from "../common/ImageWrapper/ImageWrapper";
import CommonContainer from "./common/commonContainer";

export default function SelectList() {
    const { theme } = useTheme();
    return (
        <CommonContainer topChildren={<div></div>} bottomChildren={<div></div>} />
    )
}