import { routeLink, authLink } from "./routeLink";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";

interface postProps {
  url: string;
  headers?: any;
  body?: any;
}

interface getProps {
  url: string;
  headers?: any;
}

const utils = {
  /**
   *
   * @param props
   * @returns
   */
  post: async (props: postProps) => {
    const { url, headers = {}, body = {} } = props;
    const spotifyResponse = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        ...headers,
      },
      body: body,
    });
    const data = await spotifyResponse.json();
    return data;
  },
  /**
   * @param props
   * @returns
   */
  get: async (props: getProps) => {
    const { url, headers = {} } = props;
    const spotifyResponse = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        ...headers,
      },
    });
    const data = await spotifyResponse.json();
    return data;
  },
};
export default utils;
