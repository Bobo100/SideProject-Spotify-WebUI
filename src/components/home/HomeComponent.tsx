import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
                // 然後把網址改回去
                router.replace('/');
            }
        }
        getAccessToken();
    }, [router]);

    // 導向到spotify-me.tsx 要戴上query accessToken
    const handleGetMe = async () => {
        if (!accessToken) return;
        const result = await fetch(`/api/spotify-me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken,
            }),
        });
        const data = await result.json();
        console.log(data);
        setMe(data);
    }

    const handleGetMePlaylists = async () => {
        if (!accessToken || !me) return;
        const { id } = me;
        const result = await fetch(`/api/spotify-me-playlists`, {
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
        const result = await fetch(`/api/spotify-devices`, {
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
        const result = await fetch(`/api/spotify-play`, {
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
        const result = await fetch(`/api/spotify-pause`, {
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