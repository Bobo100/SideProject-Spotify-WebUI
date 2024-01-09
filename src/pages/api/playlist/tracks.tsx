import type { NextApiRequest, NextApiResponse } from 'next';
import apiHttpsUtils from '@/utils/apiHttpsUtils';
import processUtils from '@/utils/processUtils';

/**
 * api/playlist/tracks.tsx 取得歌單中的歌曲
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlist_id } = req.body;
    const searchParams = new URLSearchParams();
    searchParams.append("market", "TW");
    // fields
    /*
    Filters for the query: a comma-separated list of the fields to return. 
    If omitted, all fields are returned. 
    For example, to get just the playlist''s description and URI: fields=description,uri. 
    A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. 
    For example, to get just the added date and user ID of the adder: fields=tracks.items(added_at,added_by.id). 
    Use multiple parentheses to drill down into nested objects, for example: fields=tracks.items(track(name,href,album(name,href))). 
    Fields can be excluded by prefixing them with an exclamation mark, 
    for example: fields=tracks.items(track(name,href,album(!name,href)))
    Example: fields=items(added_by.id,track(name,href,album(name,href)))
    */
    
    // fields=tracks.items(track(name,href,album(name,href))). 
    searchParams.append("fields", "items(track(name,href,album(name,href)))");
    const url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks' + '?' + searchParams.toString();
    try {
        const spotifyResponse = await apiHttpsUtils.getWithToken({
            url: url
        });
        await processUtils.processResponseAndReturn(spotifyResponse, res);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
