/** @type {import('next').NextConfig} */
const withLess = require("next-with-less"); //for larkmap
const path = require('node:path');

const nextConfig = {
  webpack(config, options) {
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    })
    return config;
  }
}

module.exports = withLess(nextConfig);
