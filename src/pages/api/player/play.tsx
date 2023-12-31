import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/play.tsx 播放歌曲
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { uri } = req.body;
    // body {"uri":"spotify:track:3mAc5QY56d5Zl1MbvnWybK"} 
    const body = {
        context_uri: 'spotify:playlist:5Jjn8bXv6DekewlqTF90pS',
        offset: {
            position: 0
        },
        position_ms: 0
    } as any;
    if (uri) {
        // {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]}
        body.uris = [uri];
    }
    try {
        await apiHttpsUtils.httpFetchPutWithToken({
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
