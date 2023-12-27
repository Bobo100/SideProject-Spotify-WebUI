
import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import mongoDbUtils from '@/utils/mongoDbUtils';
import _get from 'lodash/get';
import { connectToDatabase } from "@/components/common/database.service";
import processUtils from '@/utils/processUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        await connectToDatabase();
        const keyWord = _get(req, "query.keyWord", null);
        const offset = _get(req, "query.offset", 0);
        if (!keyWord) {
            return res.status(400).send("No keyWord provided");
        }
        const Params = new URLSearchParams();
        Params.append("query", keyWord as string);
        // 可帶複數的type，但我想先不用
        Params.append("type", "track");
        // 限定台灣
        Params.append("market", "TW");
        // 一次顯示幾筆
        Params.append("limit", "10");
        // offset用來做分頁
        Params.append("offset", offset as string);
        const spotifyResponse = await apiHttpsUtils.getWithToken({
            url: "https://api.spotify.com/v1/search?" + Params.toString(),
        });
        await processUtils.processResponseAndReturn(spotifyResponse, res);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    // const { refresh_token } = await mongoDbUtils.getTokens();
    // const Params = new URLSearchParams();
    // Params.append("client_id", clientId!);
    // Params.append("grant_type", "refresh_token");
    // Params.append("refresh_token", refresh_token);
    // const spotifyResponse = await apiHttpsUtils.post({
    //     url: "https://accounts.spotify.com/api/token",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: Params,
    // });
    // const new_access_token = _get(spotifyResponse, "access_token");
    // const new_refresh_token = _get(spotifyResponse, "refresh_token");
    // if (new_access_token && new_refresh_token) {
    //     await mongoDbUtils.updateTokens({
    //         access_token: new_access_token,
    //         refresh_token: new_refresh_token,
    //     });
    //     // return reply.code(200).send(spotifyResponse);
    //     res.status(200).json(spotifyResponse);
    // } else {
    //     // return reply.code(500).send(spotifyResponse);
    //     res.status(500).json(spotifyResponse);
    // }


}