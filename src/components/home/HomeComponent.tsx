import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { routeLink, authLink, userLink, playlistLink, playerLink } from "@/utils/routeLink";
import Link from "next/link";
import httpsUtils from "@/utils/httpsUtils";

export default function HomeComponent() {
    const [activeDeviceId, setActiveDeviceId] = useState<string>();
    const [me, setMe] = useState<any>();
    const router = useRouter();
    useEffect(() => {
        const getAccessToken = async () => {
            const accessToken = router.query.accessToken as string;
            if (accessToken) {
                router.replace('/');
            }
        }
        getAccessToken();
    }, [router]);

    const handleGetMe = async () => {
        const result = await httpsUtils.post({ url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.user}${userLink.profile}` });
        setMe(result);
    }

    const handleGetMePlaylists = async () => {
        if (!me) return;
        const { id } = me;
        const result = await httpsUtils.post({ url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.playlist}${playlistLink.playlists}`, body: { id } });
        console.log(result)
    }

    const handleGetDevices = async () => {
        const result = await httpsUtils.post({ url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.devices}` });
        console.log(result)
        // 會是一個array找到裡面is_active為true的那個
        const activeDevice = result.devices.find((device: any) => device.is_active);
        // console.log(activeDevice)
        const deviceId = activeDevice.id;
        setActiveDeviceId(deviceId);
    }

    const handlePlay = async () => {        
        await httpsUtils.post({
            url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.play}`,
            body: {
                activeDeviceId,
                // uris: ['spotify:track:6rqhFgbbKwnb9MLmUQDhG6']
            }
        });
    }

    const handlePause = async () => {
        await httpsUtils.post({ url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.player}${playerLink.pause}`, body: { activeDeviceId } });
    }


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