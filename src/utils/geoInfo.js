const geoip = require("geoip-lite");

function geoInfo(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

    const geo = geoip.lookup(ip) || {};
    const country = geo.country || "BD";
    const city = geo.city || null;
    const region = geo.region || null;
    const timezone = geo.timezone || null;

    return {
        ip,
        country,
        city,
        region,
        timezone,
        geo
    };
}

module.exports = geoInfo;
