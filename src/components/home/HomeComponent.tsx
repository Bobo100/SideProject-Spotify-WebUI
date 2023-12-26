import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { routeLink, authLink, userLink, playlistLink, playerLink } from "@/utils/routeLink";
import Link from "next/link";

export default function HomeComponent() {
    const [accessToken, setAccessToken] = useState<string>();
    const [activeDeviceId, setActiveDeviceId] = useState<string>();
    const [me, setMe] = useState<any>();
    const router = useRouter();
    useEffect(() => {
        const getAccessToken = async () => {
            const accessToken = router.query.accessToken as string;
            if (accessToken) {
                setAccessToken(accessToken);
                router.replace('/');
            }
        }
        getAccessToken();
    }, [router]);

    const handleGetMe = async () => {
        // if (!accessToken) return;
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.user}${userLink.profile}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     token: accessToken,
            // }),
        });
        // const data = await result.json();
        // console.log(data);
        // setMe(data);
    }

    const handleGetMePlaylists = async () => {
        if (!accessToken || !me) return;
        const { id } = me;
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.playlist}${playlistLink.playlists}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken,
                id,
            }),
        });
        const data = await result.json();
        console.log(data);
    }

    const handleGetDevices = async () => {
        if (!accessToken) return;
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.device}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken,
            }),
        });
        const data = await result.json();
        // 會是一個array找到裡面is_active為true的那個
        const activeDevice = data.devices.find((device: any) => device.is_active);
        const deviceId = activeDevice.id;
        setActiveDeviceId(deviceId);
    }

    const handlePlay = async () => {
        if (!accessToken) return;
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.play}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // 這裡要改成你要播放的歌曲的uri
                // 不帶入的話會繼續播放上一首
                // uris: ['spotify:track:6rqhFgbbKwnb9MLmUQDhG6'],
                token: accessToken,
                activeDeviceId,
            }),
        });
    }

    const handlePause = async () => {
        if (!accessToken) return;
        // 不要從url帶了 改曾param
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.pause}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken,
                activeDeviceId,
            }),
        });
    }

    useEffect(() => {
        const test = async () => {

        }
        test();
    }, []);

    return (
        <>
            <div>
                <div>
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.auth}${authLink.login}`}>Login with Spotify</Link>
                </div>
                <div>
                    <button onClick={handleGetMe}>Get Me</button>
                </div>
                <div>
                    <button onClick={handleGetMePlaylists}>Get Me Playlists</button>
                </div>
                <div>
                    {me && me.display_name}
                </div>
                <div>
                    <button onClick={handleGetDevices}>Get Devices</button>
                </div>
                <div>
                    <button onClick={handlePlay}>Play</button>
                </div>
                <div>
                    <button onClick={handlePause}>Pause</button>
                </div>
            </div>
        </>
    )
}