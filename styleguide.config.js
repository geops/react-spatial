const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

const { version } = require("./package.json");

module.exports = {
  assetsDir: "src/",
  moduleAliases: {
    "react-spatial": path.resolve(__dirname, "src"),
  },
  propsParser: (filePath) => {
    const docs = require("react-docgen-typescript")
      .withCustomConfig("./tsconfig.json")
      .parse(filePath);
    docs.forEach((doc) => {
      Object.values(doc.props).forEach((prop) => {
        if (prop.defaultValue) {
          const val = String(prop.defaultValue.value).trim();
          if (
            val === "" ||
            val === "null" ||
            val === "undefined" ||
            val.includes("=>") ||
            val.startsWith("function") ||
            /^[A-Z][a-zA-Z]/.test(val)
          ) {
            prop.defaultValue = null;
          }
        }
      });
    });
    return docs;
  },
  require: [
    path.join(__dirname, "src/themes/default/examples.scss"),
    path.join(__dirname, "src/styleguidist/styleguidist.css"),
    "ol/ol.css",
  ],
  sections: [
    {
      content: "README.md",

      name: "",
    },
    {
      components: [
        "src/components/BaseLayerSwitcher/[A-Z]*.tsx",
        "src/components/BasicMap/[A-Z]*.tsx",
        "src/components/CanvasSaveButton/[A-Z]*.tsx",
        "src/components/Copyright/[A-Z]*.tsx",
        "src/components/FeatureExportButton/[A-Z]*.tsx",
        "src/components/FitExtent/[A-Z]*.tsx",
        "src/components/Geolocation/[A-Z]*.tsx",
        "src/components/LayerTree/[A-Z]*.tsx",
        "src/components/MousePosition/[A-Z]*.tsx",
        "src/components/NorthArrow/[A-Z]*.tsx",
        "src/components/Permalink/[A-Z]*.tsx",
        "src/components/Popup/[A-Z]*.tsx",
        "src/components/Overlay/[A-Z]*.tsx",
        "src/components/ScaleLine/[A-Z]*.tsx",
        "src/components/Zoom/[A-Z]*.tsx",
      ],
      description:
        "A collection of React components for spatial web development of map components.",
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      name: "Maps",
      usageMode: "collapse", // 'hide' | 'collapse' | 'expand'
    },
    {
      components: ["src/components/RouteSchedule/[A-Z]*.tsx"],
      description:
        "A collection of React components for spatial web development of realtime components.",
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      name: "Realtime",
      usageMode: "collapse", // 'hide' | 'collapse' | 'expand'
    },
    {
      components: ["src/components/StopsFinder/StopsFinder.tsx"],
      description:
        "A collection of React components for spatial web development of stops components.",
      exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      name: "Stops",
    },
  ],
  showSidebar: true,
  styleguideComponents: {
    ComponentsList: path.join(__dirname, "src/styleguidist/ComponentsList"),
    StyleGuideRenderer: path.join(__dirname, "src/styleguidist/StyleGuide"),
    TypeRenderer: path.join(__dirname, "src/styleguidist/TypeRenderer"),
  },
  styleguideDir: "styleguide-build",
  styles: {
    ComponentsList: {
      isChild: {
        fontSize: 16,
      },
      item: {
        fontSize: 18,
        margin: "10px 0",
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
        fontSize: "1.125rem",
        lineHeight: "2.25rem",
      },
    },
    Playground: {
      preview: {
        fontSize: "18px",
        marginBottom: "24px",
      },
    },
    Section: {
      root: {
        marginBottom: "120px",
      },
    },
    StyleGuide: {
      "@global body": {
        fontFamily: "Arial",
        overflowX: "hidden",
        overflowY: "hidden",
      },
    },
  },
  template: {
    favicon: "images/favicon.png",
    head: {
      links: [
        {
          href: "https://fonts.googleapis.com/css?family=Lato:400,700",
          rel: "stylesheet",
        },
      ],
    },
  },
  theme: {
    color: {
      linkHover: "#76B833",
      links: "#6987a1",
    },
    fontFamily: {
      base: "Lato",
    },
    fontSize: {
      base: 16,
      h1: 48,
      h2: 36,
      h3: 24,
      h4: 18,
      h5: 16,
      h6: 16,
      small: 14,
      text: 17,
    },
  },
  version,
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        // Transpile js
        {
          loader: "esbuild-loader",
          options: {
            loader: "tsx",
            minify: true,
            sourcemap: true,
            // JavaScript version to compile to
            target: "es2015",
          },
          // Match js, jsx, ts & tsx files
          test: /\.[jt]sx?$/,
        },
        {
          resolve: {
            fullySpecified: false,
          },
          test: /\.m?js$/,
        },
        // Load css and scss files.
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          exclude: [
            path.resolve(__dirname, "node_modules", "@geops", "geops-ui"),
          ],
          test: /^((?!url).)*\.svg$/,
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
          include: [
            path.resolve(__dirname, "node_modules", "@geops", "geops-ui"), // Load geops-ui SVGs using file-loader
          ],
          test: /^((?!url).)*\.svg$/,
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
          loader: "url-loader",
          test: /\.url\.svg$/,
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
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    watchOptions: {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
        "**/build/**",
        "**/coverage/**",
        "**/styleguide-build/**",
      ],
    },
  },
};
