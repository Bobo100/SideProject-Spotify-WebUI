import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { getThemeClassName } from "@/utils/getThemeClassName";
import styles from "./CommonContainer.module.scss";
import _throttle from "lodash/throttle";
import _get from "lodash/get";

type CommonContainerProps = {
    topChildren: ReactNode;
    bottomChildren: ReactNode;
}
const CommonContainer = (props: CommonContainerProps) => {
    const { theme } = useTheme();
    return (
        <div className={getThemeClassName("container", styles, theme)}>
            <div className={getThemeClassName("topContainer", styles, theme)}>
                {props.topChildren}
            </div>
            <div className={getThemeClassName("bottomContainer", styles, theme)}>
                {props.bottomChildren}
            </div>
        </div >
    )
}

export default CommonContainer;