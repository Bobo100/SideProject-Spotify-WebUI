import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function HomeComponent() {
    const [accessToken, setAccessToken] = useState<string>();
    const [me, setMe] = useState<any>();
    const router = useRouter();
    useEffect(() => {
        const getAccessToken = async () => {
            //    router.query.accessToken
            const accessToken = router.query.accessToken as string;
            if (accessToken) {
                setAccessToken(accessToken);
            }
        }
        getAccessToken();
    }, [router]);

    // 導向到spotify-me.tsx 要戴上query accessToken
    const handleGetMe = async () => {
        if (!accessToken) return;
        const result = await fetch(`/api/spotify-me?token=${accessToken}`);
        const data = await result.json();
        setMe(data);
    }

    const handleGetMePlaylists = async () => {
        if (!accessToken || !me) return;
        const { id } = me;
        const result = await fetch(`/api/spotify-me-playlists?token=${accessToken}&id=${id}`);
        const data = await result.json();
        console.log(data);
    }

    return (
        <>
            <div>
                <div>
                    <a href="/api/spotify-login">Login with Spotify</a>
                </div>
                <div>
                    <button onClick={handleGetMe}>Get Me</button>
                </div>
                <div>
                    <button onClick={handleGetMePlaylists}>Get Me Playlists</button>
                </div>
            </div>
        </>
    )
}