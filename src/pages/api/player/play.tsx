import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/spotify-play.tsx 播放歌曲
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { activeDeviceId, uris } = req.body;
    try {
        // {
        //     "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
        //     "offset": {
        //         "position": 5
        //     },
        //     "position_ms": 0
        // }
        await apiHttpsUtils.httpFetchPutWithToken({
            url: 'https://api.spotify.com/v1/me/player/play',
            body: {
                // uris,
                device_id: activeDeviceId,
            },
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
