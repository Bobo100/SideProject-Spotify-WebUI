import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import mongoDbUtils from '@/utils/mongoDbUtils';
import _get from 'lodash/get';
import { connectToDatabase } from "@/components/common/database.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    await connectToDatabase();
    const { refresh_token } = await mongoDbUtils.getTokens();
    const Params = new URLSearchParams();
    Params.append("client_id", clientId!);
    Params.append("grant_type", "refresh_token");
    Params.append("refresh_token", refresh_token);
    const spotifyResponse = await apiHttpsUtils .post({
        url: "https://accounts.spotify.com/api/token",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: Params,
    });
    const new_access_token = _get(spotifyResponse, "access_token");
    const new_refresh_token = _get(spotifyResponse, "refresh_token");
    if (new_access_token && new_refresh_token) {
        await mongoDbUtils.updateTokens({
            access_token: new_access_token,
            refresh_token: new_refresh_token,
        });
        // return reply.code(200).send(spotifyResponse);
        res.status(200).json(spotifyResponse);
    } else {
        // return reply.code(500).send(spotifyResponse);
        res.status(500).json(spotifyResponse);
    }
}