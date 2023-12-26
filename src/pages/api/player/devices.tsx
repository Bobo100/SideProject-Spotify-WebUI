import type { NextApiRequest, NextApiResponse } from 'next';
/**
 * api/player/devices.tsx 取得使用者的裝置
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;
    try {
        const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!spotifyResponse.ok) {
            throw new Error(`Error: ${spotifyResponse.status}`);
        }

        const data = await spotifyResponse.json();
        res.status(200).json(data); // 這個就會回傳給前端
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
