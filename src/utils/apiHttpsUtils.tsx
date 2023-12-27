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
    } else if (errorStatus) {
      return data;
    } else {
      return data;
    }
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
    } else if (errorStatus) {
      return data;
    } else {
      return data;
    }
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
    } else if (errorStatus) {
      return data;
    } else {
      return data;
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
    } else if (errorStatus) {
      return data;
    } else {
      return data;
    }
  },
  /**
   * 帶有token的put
   */
  httpFetchPutWithToken: async (props: postProps) => {
    const { url, headers = {}, body = {} } = props;
    await connectToDatabase();
    const { access_token } = await mongoDbUtils.getTokens();
    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        ...headers,
      },
      body: body,
    });
    return;
  },
};
export default utils;