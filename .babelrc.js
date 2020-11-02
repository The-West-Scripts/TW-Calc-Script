const { version } = require('./package.json');

module.exports = api => {
    // TODO: configure .babelrc caching
    api.cache(false);

    const presets = [['minify'], ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }]];
    const plugins = [
        ['@babel/plugin-transform-runtime'],
        ['@babel/plugin-transform-typescript', { sourceMap: false }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties'],
        [
            'search-and-replace',
            {
                rules: getSearchAndReplaceRules(),
            },
        ],
    ];

    return {
        presets,
        plugins,
    };
};

function getSearchAndReplaceRules() {
    const values = {
        VERSION: version,
    };

    return Object.keys(values).map(key => ({
        search: RegExp(`<@${key}@>`),
        replace: values[key],
    }));
}
