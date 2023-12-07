const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const { version } = require("./package.json");

module.exports = {
  version,
  template: {
    favicon: "images/favicon.png",
    head: {
      links: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Lato:400,700",
        },
      ],
    },
  },
  assetsDir: "src/",
  styleguideDir: "styleguide-build",
  require: [
    path.join(__dirname, "src/themes/default/examples.scss"),
    path.join(__dirname, "src/styleguidist/styleguidist.css"),
    "ol/ol.css",
  ],
  moduleAliases: {
    "react-spatial": path.resolve(__dirname, "src"),
  },
  sections: [
    {
      name: "",

      content: "README.md",
    },
    {
      name: "Maps",
      description:
        "A collection of React components for spatial web development of map components.",
      components: [
        "src/components/BaseLayerSwitcher/[A-Z]*.js",
        "src/components/BasicMap/[A-Z]*.js",
        "src/components/CanvasSaveButton/[A-Z]*.js",
        "src/components/Copyright/[A-Z]*.js",
        "src/components/FeatureExportButton/[A-Z]*.js",
        "src/components/FitExtent/[A-Z]*.js",
        "src/components/Geolocation/[A-Z]*.js",
        "src/components/LayerTree/[A-Z]*.js",
        "src/components/MousePosition/[A-Z]*.js",
        "src/components/NorthArrow/[A-Z]*.js",
        "src/components/Permalink/[A-Z]*.js",
        "src/components/Popup/[A-Z]*.js",
        "src/components/Overlay/[A-Z]*.js",
        "src/components/ScaleLine/[A-Z]*.js",
        "src/components/Zoom/[A-Z]*.js",
      ],
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      usageMode: "collapse", // 'hide' | 'collapse' | 'expand'
    },
    {
      name: "Realtime",
      description:
        "A collection of React components for spatial web development of realtime components.",
      components: ["src/components/RouteSchedule/[A-Z]*.js"],
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      usageMode: "collapse", // 'hide' | 'collapse' | 'expand'
    },
    {
      name: "Stops",
      description:
        "A collection of React components for spatial web development of stops components.",
      components: ["src/components/StopsFinder/StopsFinder.js"],
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
    },
  ],
  webpackConfig: {
    optimization: {
      minimize: false, // Terser minification is broken since webpack 5
      minimizer: [
        // new TerserPlugin({
        //   test: /build\//,
        //   include: /\/build/,
        // }),
        // new TerserPlugin<SwcOptions>({
        //   minify: TerserPlugin.swcMinify,
        //   terserOptions: {
        //     // `swc` options
        //   },
        // }),
        // new TerserPlugin<UglifyJSOptions>({
        //   minify: TerserPlugin.uglifyJsMinify,
        //   terserOptions: {
        //     // `uglif-js` options
        //   },
        // }),
        new TerserPlugin({
          minify: TerserPlugin.esbuildMinify,
          // test: /Line\.js$/,
          terserOptions: {
            // `esbuild` options
            // loader: '.js=jsx',
            loader: "jsx",
          },
        }),
      ],
    },
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        // Transpile js
        {
          // Match js, jsx, ts & tsx files
          test: /\.[jt]sx?$/,
          loader: "esbuild-loader",
          options: {
            // JavaScript version to compile to
            target: "es2015",
            loader: "jsx",
            minify: true,
            sourcemap: true,
          },
        },
        // Load css and scss files.
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /^((?!url).)*\.svg$/,
          exclude: [
            path.resolve(__dirname, "node_modules", "@geops", "geops-ui"),
          ],
          use: [
            { loader: "babel-loader" },
            {
              loader: "react-svg-loader",
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
        {
          test: /^((?!url).)*\.svg$/,
          include: [
            path.resolve(__dirname, "node_modules", "@geops", "geops-ui"), // Load geops-ui SVGs using file-loader
          ],
          use: [
            {
              loader: require.resolve("@svgr/webpack"),
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      removeViewBox: false,
                    },
                  ],
                },
              },
            },
            {
              loader: "file-loader",
              options: {
                jsx: true,
              },
            },
          ],
        },
        {
          test: /\.url\.svg$/,
          loader: "url-loader",
        },
        {
          test: /\.png$|.ico$/,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
      ],
    },
  },
  theme: {
    color: {
      links: "#6987a1",
      linkHover: "#76B833",
    },
    fontFamily: {
      base: "Lato",
    },
    fontSize: {
      base: 16,
      text: 17,
      small: 14,
      h1: 48,
      h2: 36,
      h3: 24,
      h4: 18,
      h5: 16,
      h6: 16,
    },
  },
  styles: {
    StyleGuide: {
      "@global body": {
        overflowY: "hidden",
        overflowX: "hidden",
        fontFamily: "Arial",
      },
    },
    Playground: {
      preview: {
        fontSize: "18px",
        marginBottom: "24px",
      },
    },
    Heading: {
      heading: {
        fontWeight: 900,
        marginTop: 50,
      },
      heading1: {
        marginTop: 0,
      },
    },
    Para: {
      para: {
        lineHeight: "2.25rem",
        fontSize: "1.125rem",
      },
    },
    ComponentsList: {
      isChild: {
        fontSize: 16,
      },
      item: {
        margin: "10px 0",
        fontSize: 18,
      },
    },
    Section: {
      root: {
        marginBottom: "120px",
      },
    },
  },
  showSidebar: true,
  styleguideComponents: {
    ComponentsList: path.join(__dirname, "src/styleguidist/ComponentsList"),
    StyleGuideRenderer: path.join(__dirname, "src/styleguidist/StyleGuide"),
  },
};
