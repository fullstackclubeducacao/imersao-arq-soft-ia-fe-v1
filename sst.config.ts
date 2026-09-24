/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "fe-url-shortener",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.StaticSite("MyWeb", {
      domain: "bitly-app.fullstackclub.com.br",
      build: {
        command: "pnpm run build",
        output: "dist",
      },
    });
  },
});
