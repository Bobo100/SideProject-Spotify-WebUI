import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/skipNext.tsx 跳下一首
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { activeDeviceId } = req.body;
    try {
        await apiHttpsUtils.httpFetchPutWithToken({
            url: 'https://api.spotify.com/v1/me/player/next',
            body: {
                device_id: activeDeviceId,
            },
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
