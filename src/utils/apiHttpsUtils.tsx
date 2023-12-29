import { routeLink, authLink } from "./routeLink";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import mongoDbUtils from "./mongoDbUtils";
import httpsUtils from "./httpsUtils";
import { connectToDatabase } from "@/components/common/database.service";

interface postProps {
  url: string;
  headers?: any;
  body?: any;
}

interface getProps {
  url: string;
  headers?: any;
}

const refreshLink = `${process.env.NEXT_PUBLIC_BASE_API_URL}${routeLink.auth}${authLink.refresh}`;

const utils = {
  /**
   * 帶有token的post
   * @param props
   * @returns
   */
  postWithToken: async (props: postProps) => {
    const { url, headers = {}, body = {} } = props;
    await connectToDatabase();
    const { access_token } = await mongoDbUtils.getTokens();
    const spotifyResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        ...headers,
      },
      body: body,
    });
    const data = await spotifyResponse.json();
    const errorStatus = _get(data, "error.status");
    if (_isEqual(errorStatus, 401)) {
      await httpsUtils.get({ url: refreshLink });
      await utils.postWithToken(props);
    }
    return data;
  },
  /**
   * 沒帶token的post
   * @param props
   * @returns
   */
  post: async (props: postProps) => {
    const { url, headers = {}, body = {} } = props;
    await connectToDatabase();
    const spotifyResponse = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await spotifyResponse.json();
    const errorStatus = _get(data, "error.status");
    if (_isEqual(errorStatus, 401)) {
      await httpsUtils.get({ url: refreshLink });
      await utils.post(props);
    }
    return data;
  },
  /**
   * 帶有token的get
   * @param props
   * @returns
   */
  getWithToken: async (props: getProps) => {
    const { url, headers = {} } = props;
    await connectToDatabase();
    const { access_token } = await mongoDbUtils.getTokens();
    const spotifyResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        ...headers,
      },
    });
    const data = await spotifyResponse.json();
    const errorStatus = _get(data, "error.status");
    if (_isEqual(errorStatus, 401)) {
      await httpsUtils.get({ url: refreshLink });
      await utils.getWithToken(props);
    }
    return data;
  },
  /**
   * 沒帶token的get
   * @param props
   * @returns
   */
  get: async (props: getProps) => {
    const { url, headers = {} } = props;
    await connectToDatabase();
    const spotifyResponse = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await spotifyResponse.json();
    const errorStatus = _get(data, "error.status");
    if (_isEqual(errorStatus, 401)) {
      await httpsUtils.get({ url: refreshLink });
      await utils.get(props);
    }
    return data;
  },
  /**
   * 帶有token的put
   */

  //   curl --request PUT \
  //   --url https://api.spotify.com/v1/me/player/play \
  //   --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z' \
  //   --header 'Content-Type: application/json' \
  //   --data '{
  //     "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
  //     "offset": {
  //         "position": 5
  //     },
  //     "position_ms": 0
  // }'
  httpFetchPutWithToken: async (props: postProps) => {
    const { url, headers = {}, body = {} } = props;
    await connectToDatabase();
    const { access_token } = await mongoDbUtils.getTokens();
    const spotifyResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    });
    // const result = await spotifyResponse.json();
    // console.log("result", result);
    return;
  },
};
export default utils;
