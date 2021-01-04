
module.exports = function(api) {
    api.cache(true);
    return {
        presets: ["@babel/preset-react", ['@babel/preset-env',

                        // Tell babel to avoid compiling imports into CommonJS
                        // so that webpack may do tree shaking.
                        {
                            modules: false,

                            // Specify our target browsers so no transpiling is
                            // done unnecessarily. For browsers not specified
                            // here, the ES2015+ profile will be used.
                            targets: {
                                chrome: 58,
                                electron: 2,
                                firefox: 54,
                                safari: 11
                            }
                        }
                    ]
        ],
        plugins: [
            "@babel/plugin-transform-flow-strip-types",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-export-namespace-from"
        ]
    }
};
