import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/seek.tsx 更改目前播放的時間
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { activeDeviceId, position_ms } = req.body;
    const searchParams = new URLSearchParams();
    searchParams.append('device_id', activeDeviceId);
    searchParams.append('position_ms', position_ms);
    const url = 'https://api.spotify.com/v1/me/player/seek' + '?' + searchParams.toString();
    try {
        await apiHttpsUtils.httpFetchPutWithToken({
            url: url,
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
