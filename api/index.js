const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

const manifest = {
    id: "com.personal.rule34",
    version: "1.0.0",
    name: "Rule34 Hentai",
    description: "Free hentai from rule34.xxx",
    resources: ["catalog", "stream"],
    types: ["movie"],
    catalogs: [
        { type: "movie", id: "popular", name: "Popular" },
        { type: "movie", id: "recent", name: "Recent" },
        { type: "movie", id: "hentai", name: "Hentai" },
        { type: "movie", id: "big-tits", name: "Big Tits" },
        { type: "movie", id: "ahegao", name: "Ahegao" }
    ],
    idPrefixes: ["r34"],
    behaviorHints: { configurable: false }
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ id }) => {
    try {
        let tags = "";

        if (id === "popular") tags = "score:>100";
        if (id === "recent") tags = "sort:random";
        if (id === "hentai") tags = "hentai";
        if (id === "big-tits") tags = "big_breasts";
        if (id === "ahegao") tags = "ahegao";

        const res = await axios.get(`https://api.rule34.xxx/index.php`, {
            params: {
                page: "dapi",
                s: "post",
                q: "index",
                json: 1,
                tags: tags,
                limit: 20
            },
            timeout: 15000
        });

        const posts = res.data || [];

        const metas = posts.map(post => ({
            id: `r34:${post.id}`,
            type: "movie",
            name: post.tags ? post.tags.split(" ").slice(0, 3).join(" ") : "Rule34 Post",
            poster: post.preview_url || post.sample_url,
            background: post.sample_url || post.file_url,
            description: `Tags: ${post.tags || "No tags"}`,
            genres: post.tags ? post.tags.split(" ").slice(0, 5) : []
        }));

        return { metas };
    } catch (e) {
        console.error("Catalog error:", e.message);
        return { metas: [] };
    }
});

builder.defineStreamHandler(async ({ id }) => {
    try {
        const postId = id.replace("r34:", "");

        const res = await axios.get(`https://api.rule34.xxx/index.php`, {
            params: {
                page: "dapi",
                s: "post",
                q: "index",
                json: 1,
                id: postId
            },
            timeout: 15000
        });

        const post = res.data && res.data[0];
        if (!post || !post.file_url) return { streams: [] };

        const streams = [{
            url: post.file_url,
            title: "Original Quality",
            behaviorHints: { bingeGroup: "r34" }
        }];

        // Add sample version if available
        if (post.sample_url && post.sample_url !== post.file_url) {
            streams.push({
                url: post.sample_url,
                title: "Sample Quality"
            });
        }

        return { streams };
    } catch (e) {
        console.error("Stream error:", e.message);
        return { streams: [] };
    }
});

module.exports = builder.getInterface();