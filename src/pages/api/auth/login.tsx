import type { NextApiRequest, NextApiResponse } from 'next';
import { routeLink, authLink } from '@/utils/routeLink';
import crypto from 'crypto';

function generateCodeVerifier(length: number) {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let array = new Uint8Array(length);
    crypto.randomFillSync(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array as any);
}

async function createCodeChallenge(codeVerifier: string) {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const params = new URLSearchParams();
    params.append("client_id", clientId!);
    params.append("response_type", "code");
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.auth}${authLink.callback}`;
    params.append("redirect_uri", redirectUri);
    params.append("scope", "user-read-private user-read-email user-read-playback-state user-modify-playback-state");
    params.append("code_challenge_method", "S256");
    const codeVerifier = generateCodeVerifier(128);
    res.setHeader('Set-Cookie', `codeVerifier=${codeVerifier}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600;`);
    const codeChallenge = await createCodeChallenge(codeVerifier);
    params.append("code_challenge", codeChallenge);
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}