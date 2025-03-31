//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },

  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'",
  },
];

module.exports = withNx({
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.

        source: '/(.*)',

        headers: securityHeaders,
      },
    ];
  },

  ...nextConfig,
  images: {
    domains: ['172.20.110.45', '172.20.110.60', 'avatars.gscwd.app'],
  },
});
