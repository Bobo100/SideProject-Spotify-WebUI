import { collections } from "@/components/common/database.service";
import _get from "lodash/get";
import { connectToDatabase } from "@/components/common/database.service";

const utils = {
    getTokens: async () => {
        await connectToDatabase();
        const token = await collections.token.findOne({});
        const access_token = _get(token, "access_token");
        const refresh_token = _get(token, "refresh_token");
        return {
            access_token,
            refresh_token,
        };
    },
    updateTokens: async (tokens: any) => {
        await connectToDatabase();
        collections.token.updateOne(
            {},
            {
                $set: {
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                },
            },
            { upsert: true }
        );
    },
}

export default utils;