// pages/api/spotify-callback.js
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code || null;

    if (code) {
        try {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
            const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
            // 設置從spotify的redirect_uri 記得spotify的Dashboard要設定
            // 才能正確的redirect 獲得我們要的token
            const redirectUri = 'http://localhost:3000/api/spotify-callback/';
            const params = new URLSearchParams();
            params.append("client_id", clientId!);
            params.append("client_secret", clientSecret!);
            params.append("grant_type", "authorization_code");
            params.append("code", code as string);
            params.append("redirect_uri", redirectUri);
            const result = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });
            const data = await result.json();
            const { access_token } = data;
            // 取得token後，將token傳回前端
            res.redirect(`http://localhost:3000/?accessToken=${access_token}`);
        } catch (error) {
        }
    } else {
        res.status(400).send('No code provided');
    }
}
