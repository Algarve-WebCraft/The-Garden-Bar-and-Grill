export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./src/css": "css",
    "./src/js": "js",
    "./src/assets": "assets",
    "./src/admin": "admin",
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
    templateFormats: ["njk", "html", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
