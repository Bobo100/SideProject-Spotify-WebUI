// pages/api/spotify-pause.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, activeDeviceId } = req.body;
    try {
        const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (!spotifyResponse.ok) {
            throw new Error(`Error: ${spotifyResponse.status}`);
        }
        res.status(200).json({ paused: true }); // 這個就會回傳給前端
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
