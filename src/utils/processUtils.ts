import _get from "lodash/get";
import type { NextApiRequest, NextApiResponse } from "next";

const utils = {
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
