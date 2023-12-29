import _get from "lodash/get";
import type { NextApiRequest, NextApiResponse } from "next";

const utils = {
  filterSearch: (data: any) => {
    const result = data.tracks.items.map((item: any) => {
      return {
        name: item.name,
        images: item.album.images[item.album.images.length - 2].url,
        external_url: item.external_urls.spotify,
        uri: item.uri,
        author: item.artists.map((artist: any) => artist.name).join(", "),
      };
    });
    const prevUrl = data.tracks.previous;
    const nextUrl = data.tracks.next;
    const limit = data.tracks.limit;
    const offset = data.tracks.offset;
    const total = data.tracks.total;
    return {
      result,
      prevUrl,
      nextUrl,
      limit,
      offset,
      total,
    };
  },
  filterQueue: (data: any) => {
    const result = data.queue.map((item: any) => {
      return {
        name: item.name,
        images: item.album.images[item.album.images.length - 2].url,
        external_url: item.external_urls.spotify,
        uri: item.uri,
      }
    })
    return result
  },
  processResponseAndReturn: async (responseData: any, res: NextApiResponse) => {
    const errorStatus = _get(responseData, "error.status");
    if (errorStatus) {
      res.status(errorStatus).send(responseData);
    } else {
      res.status(200).send(responseData);
    }
  },
};

export default utils;
