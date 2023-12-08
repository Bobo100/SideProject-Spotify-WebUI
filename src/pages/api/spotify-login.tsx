// pages/api/spotify-login.js
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// 生成 Code Verifier
function generateCodeVerifier(length: number) {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let array = new Uint8Array(length);
    crypto.randomFillSync(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
}

// 创建 Code Challenge
async function createCodeChallenge(codeVerifier: string) {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const params = new URLSearchParams();
    params.append("client_id", clientId!);
    params.append("response_type", "code");
    const redirectUri = 'http://localhost:3000/api/spotify-callback/';
    params.append("redirect_uri", redirectUri);
    params.append("scope", "user-read-private user-read-email user-read-playback-state user-modify-playback-state");
    // 為了防止CSRF攻擊，我們需要在發送請求時，帶上code_challenge_method和code_challenge
    params.append("code_challenge_method", "S256");
    const codeVerifier = generateCodeVerifier(128);
    // 將codeVerifier存入cookie
    // 但要注意安全性，所以要設定HttpOnly 意思是javascript都不能讀取到這個cookie
    // Secure 意思是只能在https下才能讀取到這個cookie
    // SameSite=Lax 意思是只有在同一個網域下才能讀取到這個cookie
    // Path=/ 意思是在所有路徑下都能讀取到這個cookie
    // Max-Age=3600 意思是這個cookie的存活時間為3600秒
    // res.setHeader('Set-Cookie', `codeVerifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600;`);
    res.setHeader('Set-Cookie', `codeVerifier=${codeVerifier}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600;`);
    const codeChallenge = await createCodeChallenge(codeVerifier);
    params.append("code_challenge", codeChallenge);
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}