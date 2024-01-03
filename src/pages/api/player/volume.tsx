import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/volume.tsx 設定音量
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { volume = 50 } = req.body;
    try {
        await apiHttpsUtils.httpFetchPutWithToken({
            url: 'https://api.spotify.com/v1/me/player/volume',
            body: {
                volume_percent: volume
            },
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
