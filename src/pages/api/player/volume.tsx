import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/volume.tsx 設定音量
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { activeDeviceId, volume = 50 } = req.body;
    const searchParams = new URLSearchParams();
    searchParams.append('device_id', activeDeviceId);
    searchParams.append('volume_percent', volume.toString());
    const url = 'https://api.spotify.com/v1/me/player/volume' + '?' + searchParams.toString();
    try {
        await apiHttpsUtils.httpFetchPutWithToken({
            url: url,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
