import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';

/**
 * api/player/play.tsx 播放歌曲
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { context_uri, uri } = req.body;
    const body = {
        context_uri: context_uri,
        offset: {
            position: 0
        },
        position_ms: 0
    } as any;
    if (uri) {
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
