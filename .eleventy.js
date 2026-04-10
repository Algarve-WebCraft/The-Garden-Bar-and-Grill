export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./src/css": "css",
    "./src/js": "js",
    "./src/admin": "admin",
  });

  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({ "./assets": "/" });
  }

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
