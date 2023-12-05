// pages/api/spotify.js
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;
    try {
        const spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!spotifyResponse.ok) {
            throw new Error(`Error: ${spotifyResponse.status}`);
        }

        const data = await spotifyResponse.json();
        res.status(200).json(data); // 這個就會回傳給前端
    } catch (error) {
    }
}
