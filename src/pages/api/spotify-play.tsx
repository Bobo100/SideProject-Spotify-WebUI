// pages/api/spotify-play.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, activeDeviceId, uris } = req.body;
    console.log(req.body);
    try {
        // {
        //     "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
        //     "offset": {
        //         "position": 5
        //     },
        //     "position_ms": 0
        // }
        const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            // 額外
            body: JSON.stringify({
                // uris: ['spotify:track:6rqhFgbbKwnb9MLmUQDhG6'],
            }),
        });
        if (!spotifyResponse.ok) {
            throw new Error(`Error: ${spotifyResponse.status}`);
        }
        res.status(200).json({ playing: true }); // 這個就會回傳給前端
    } catch (error) {
    }
}
