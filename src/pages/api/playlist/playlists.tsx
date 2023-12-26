import type { NextApiRequest, NextApiResponse } from 'next';
/**
 * api/playlist/playlists.tsx 取得使用者的歌單
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, id } = req.body;
    try {
        // https://api.spotify.com/v1/users/{user_id}/playlists
        const spotifyResponse = await fetch('https://api.spotify.com/v1/users/' + id + '/playlists', {
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
