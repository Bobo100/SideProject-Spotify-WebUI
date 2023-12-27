import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import processUtils from '@/utils/processUtils';

/**
 * api/user/profile.tsx 取得使用者資料
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const spotifyResponse = await apiHttpsUtils.getWithToken({
            url: 'https://api.spotify.com/v1/me'
        });
        await processUtils.processResponseAndReturn(spotifyResponse, res);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
