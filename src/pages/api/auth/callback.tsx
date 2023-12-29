import type { NextApiRequest, NextApiResponse } from 'next';
import { routeLink, authLink } from '@/utils/routeLink';
import mongoDbUtils from '@/utils/mongoDbUtils';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code || null;
    if (code) {
        try {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
            const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
            const redirectUri = `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.auth}${authLink.callback}`;
            const params = new URLSearchParams();
            params.append("client_id", clientId!);
            params.append("client_secret", clientSecret!);
            params.append("grant_type", "authorization_code");
            params.append("code", code as string);
            params.append("redirect_uri", redirectUri);
            const codeVerifier = req.cookies.codeVerifier;
            params.append("code_verifier", codeVerifier!);
            const result = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });
            const data = await result.json();
            const { access_token, refresh_token } = data;
            await mongoDbUtils.updateTokens({
                access_token: access_token,
                refresh_token: refresh_token,
            });
            res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
        } catch (error) {
        }
    } else {
        res.status(400).send('No code provided');
    }
}
