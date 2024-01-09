export const playerlistType = {
    search: "search",
    player: "player",
    playlist: "playlist",
};

export type filterSearchType = {
    name: string;
    images: string;
    external_url: string;
    uri: string;
    author?: string[];
};

export type filterPlayListType = {
    name: string;
    images: string;
    external_url: string;
    uri: string;
    id: string;
};
