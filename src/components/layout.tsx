import Head from "next/head";
import Footer from "./common/Footer/Footer";
import NavBar from "./common/NavBar/NavBar";
import styles from "./layout.module.scss";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    content?: string;
}
export default function Layout({ children, title, content }: LayoutProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleRouteChangeStart = () => {
            document.querySelector('.progress_bar')?.classList.add(styles.progress_bar_active);
        };

        const handleRouteChangeComplete = () => {
            document.querySelector('.progress_bar')?.classList.remove(styles.progress_bar_active);
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router.events]);

    if (!mounted) {
        return null;
    }

    return (
        <div id="layout"
            className={`${styles.container} ${theme === 'light' ? styles.container_light : styles.container_dark}`} >
            <Head>
                {/* https://stackoverflow.com/questions/44752189/how-to-add-font-awesome-to-next-js-project */}
                {/* <script
                    // you might need to get a newer version
                    src="https://kit.fontawesome.com/fbadad80a0.js"
                    crossOrigin="anonymous"
                ></script> */}
                <title>{title ? title : "Index"}</title>               
            </Head>
            <div className={`progress_bar ${styles.progress_bar}`} />
            <NavBar />
            <div className="pt-20">
                {children}
            </div>
            <Footer />
        </div>
    );
}