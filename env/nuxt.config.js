// process.env.DEBUG = 'nuxt:*';

const path = require('path');
const open = require('open');

module.exports = {
  dev: process.env.NODE_ENV === 'development',
  srcDir: 'src/',
  css: [],
  env: {},

  build: {
    analyze: getAnalyzerConfig(),
    babel: {
      presets ({ isServer }) {
        const targets = isServer ? { node: 'current' } : { ie: 11 };
        return [
          [
            require.resolve('@nuxt/babel-preset-app'), { targets }
          ]
        ];
      }
    },
    postcss: {
      plugins: {
        'postcss-normalize': {},
        'postcss-object-fit-images': {},
        '@fullhuman/postcss-purgecss': {
          content: [
            'src/pages/**/*.vue',
            'src/layouts/**/*.vue',
            'src/components/**/*.vue'
          ],
          whitelist: [
            'html', 'body'
          ],
          whitelistPatterns: [
            /nuxt-/
          ]
        },
        'postcss-momentum-scrolling': [
          'scroll'
        ],
        'rucksack-css': {}
      },
      preset: {
        stage: 0,
        features: {
          'nesting-rules': true
        },
        importFrom: 'src/globals/postcss.js'
      }
    },
    parallel: true,
    transpile: []
  },

  generate: {
    dir: 'dist/website'
  },

  render: {
    http2: { push: true }
  },

  router: {
    base: '/'
  },

  hooks: {
    build: {
      done: function () {
        if (process.env.NODE_ENV === 'development' && !process.env.TRAVIS) {
          open('http://localhost:8050', {
            app: [
              'google chrome', '--incognito'
            ]
          });
        }
      }
    }
  },

  plugins: [
    { src: '@/plugins/intersectionObserver' }
  ],

  modules: [
    '@/modules/fix/image',
    '@/modules/virtual',
    '@/modules/svg',
    '@/modules/image',
    '@nuxtjs/axios',
    [
      '@bazzite/nuxt-optimized-images', {
        handleImages: [
          'jpeg', 'png', 'gif'
        ],
        responsive: {
          adapter: require(__dirname + '/../src/modules/responsive-loader/adapter.js')
        },
        optimizeImagesInDev: true,
        mozjpeg: {
          quality: 70,
          progressive: true,
          sample: [
            '2x2'
          ]
        },
        pngquant: {
          quality: '75-100'
        },
        optipng: {
          optimizationLevel: 3
        },
        gifsicle: {
          interlaced: true,
          optimizationLevel: 3
        }
      }
    ],
    [
      'nuxt-i18n', {
        locales: [
          {
            code: 'en',
            iso: 'en-US',
            file: 'en.json',
          },
          {
            code: 'de',
            iso: 'de-DE',
            file: 'de.json'
          }
        ],
        lazy: true,
        langDir: 'globals/locales/',
        defaultLocale: 'de',
        strategy: 'prefix_except_default',
        seo: true,
        vueI18nLoader: true
      }
    ],
    [
      '@nuxtjs/pwa', {
        dev: process.env.NODE_ENV === 'development',
        icon: {
          iconSrc: 'src/static/favicon.png',
          sizes: [
            16, 120, 144, 152, 192, 384, 512
          ]
        },
        meta: {
          charset: 'utf-8',
          viewport: 'width=device-width, initial-scale=1',
          mobileApp: true,
          mobileAppIOS: true,
          appleStatusBarStyle: 'default',
          favicon: true,
          name: 'TITLE',
          author: 'metaAuthor',
          description: 'metaDescription',
          theme_color: 'black',
          lang: 'de',
          ogType: 'website',
          ogSiteName: 'ogSITE_NAME',
          ogTitle: 'ogTITLE',
          ogDescription: 'ogDESCRIPTION',
          ogHost: undefined,
          ogImage: true
        },
        manifest: {
          name: 'Sample MANIFEST',
          short_name: 'Sample',
          lang: 'de'
        }
      }
    ],
    [
      '@nuxtjs/sitemap', {
        path: 'sitemap.xml',
        hostname: 'https://localhost:8050',
        cacheTime: 1000 * 60 * 15,
        gzip: false,
        exclude: [],
        routes: [],
        defaults: {
          changefreq: 'daily',
          priority: 1,
          lastmod: new Date(),
          lastmodrealtime: true
        }
      }
    ],
    [
      '@nuxtjs/robots', {
        UserAgent: '*',
        Disallow: '',
        Sitemap: 'https://localhost:8050/sitemap.xml'
      }
    ],
    [
      '@/modules/licence', {
        perChunkOutput: false,
        handleMissingLicenseText: (packageName) => {
          return 'NO LICENSE TEXT: ' + packageName;
        },
        licenseTextOverrides: {
          'regenerator-runtime': `MIT License

            Copyright (c) 2014-present, Facebook, Inc.

            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.`,
          'consola': 'MIT License'
        }
      }
    ]
  ],

  head: {
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
    ],
    link: [],
    // script: [
    //   {
    //     src:
    //       'https://cdn.polyfill.io/v2/polyfill.min.js?features=HTMLPictureElement',
    //     defer: true
    //   },
    //   {
    //     innerHTML:
    //       'document.createElement( "picture" );document.createElement( "source" );'
    //   }
    // ],
    // __dangerouslyDisableSanitizers: ['script']
  }
};

function getAnalyzerConfig () {
  if (process.env.NODE_ENV === 'production') {
    return {
      analyzerMode: 'static',
      reportFilename: path.resolve('dist/reports/webpack-bundle-analyzer.html'),
      openAnalyzer: true
    };
  } else {
    return false;
  }
}
