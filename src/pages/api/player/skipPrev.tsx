import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import processUtils from '@/utils/processUtils';

/**
 * api/player/previous .tsx 暫停播放
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { activeDeviceId } = req.body;
    try {
        const spotifyResponse = await apiHttpsUtils.postWithToken({
            url: 'https://api.spotify.com/v1/me/player/previous ',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device_id: activeDeviceId
            })
        });
        await processUtils.processResponseAndReturn(spotifyResponse, res);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
