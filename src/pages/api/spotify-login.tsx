// pages/api/spotify-login.js
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const params = new URLSearchParams();
    params.append("client_id", clientId!);
    params.append("response_type", "code");
    const redirectUri = 'http://localhost:3000/api/spotify-callback/';
    params.append("redirect_uri", redirectUri);
    params.append("scope", "user-read-private user-read-email");
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}