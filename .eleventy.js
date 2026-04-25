export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./src/css": "css",
    "./src/js": "js",
    "./src/admin": "admin",
    /* "./src/assets": "assets", */
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
