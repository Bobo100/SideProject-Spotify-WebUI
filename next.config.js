const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["i.scdn.co"], // Add 'i.ytimg.com' to the list of allowed domains
  },
};
