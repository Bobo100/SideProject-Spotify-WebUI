import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import processUtils from '@/utils/processUtils';

/**
 * api/player/devices.tsx 取得使用者的裝置
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const spotifyResponse = await apiHttpsUtils.getWithToken({
            url: 'https://api.spotify.com/v1/me/player/devices'
        });
        await processUtils.processResponseAndReturn(spotifyResponse, res);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
