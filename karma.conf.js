const rollupConfig = require('./rollup.config');

module.exports = config => {
    const rollupPreprocessor = {
        plugins: rollupConfig.plugins,
        output: rollupConfig.output,
    };

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [{ pattern: 'tests/support/dist/index.ts', watched: false }],
        exclude: [],
        preprocessors: {
            'src/**/*.ts': ['rollup'],
            'tests/support/dist/**/*.ts': ['rollup'],
        },
        plugins: ['karma-spec-reporter', 'karma-rollup-preprocessor', 'karma-jasmine', 'karma-chrome-launcher'],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        concurrency: Infinity,
        mime: { 'text/x-typescript': ['ts'] },
        rollupPreprocessor,
    });
};
