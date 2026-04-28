const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const axios = require("axios");

const manifest = {
    id: "com.personal.hanime",
    version: "1.0.0",
    name: "Hanime (Personal)",
    description: "My personal Hanime.tv addon",
    resources: ["catalog", "meta", "stream"],
    types: ["movie"],
    catalogs: [
        { type: "movie", id: "trending", name: "Trending" },
        { type: "movie", id: "recent", name: "Recent" },
        { type: "movie", id: "most-views", name: "Most Views" }
    ],
    idPrefixes: ["hanime"],
    config: [
        { key: "email", type: "text", title: "Hanime Email", required: true },
        { key: "password", type: "password", title: "Hanime Password", required: true }
    ]
};

const builder = new addonBuilder(manifest);

async function loginHanime(email, password) {
    try {
        const res = await axios.post("https://hanime.tv/api/v1/auth/login", {
            email,
            password
        });
        return res.data.session_token || res.data.token;
    } catch (e) {
        return null;
    }
}

builder.defineCatalogHandler(async ({ id }) => {
    let sort = "trending";
    if (id === "recent") sort = "recent";
    if (id === "most-views") sort = "most_views";

    const res = await axios.get(`https://hanime.tv/api/v1/videos?sort=${sort}`);
    const metas = res.data.videos.map(v => ({
        id: `hanime:${v.slug}`,
        type: "movie",
        name: v.name,
        poster: v.cover_url,
        background: v.poster_url,
        description: v.description || "",
        genres: v.tags || []
    }));
    return { metas };
});

builder.defineStreamHandler(async ({ id, config }) => {
    if (!config?.email || !config?.password) return { streams: [] };

    const slug = id.replace("hanime:", "");
    const token = await loginHanime(config.email, config.password);
    if (!token) return { streams: [] };

    try {
        const res = await axios.get(`https://hanime.tv/api/v1/videos/${slug}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const streams = (res.data.streams || []).map(s => ({
            url: s.url,
            title: `${s.resolution}p`
        }));
        return { streams };
    } catch (e) {
        return { streams: [] };
    }
});

const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);

module.exports = (req, res) => {
    router(req, res, () => {
        res.statusCode = 404;
        res.end();
    });
};