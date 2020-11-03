const { version } = require('./package.json');

module.exports = api => {
    // TODO: configure .babelrc caching
    api.cache(false);

    const presets = [['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }]];
    const plugins = [
        ['@babel/plugin-transform-runtime'],
        ['search-and-replace', { rules: getSearchAndReplaceRules() }],
    ];

    return {
        presets,
        plugins,
    };
};

function getSearchAndReplaceRules() {
    const { version, author, contributors } = require('./package.json');
    const values = {
        VERSION: version,
        AUTHOR: author,
        CONTRIBUTORS: contributors.join(', '),
    };

    return Object.keys(values).map(key => ({
        search: RegExp(`<@${key}@>`),
        replace: values[key],
    }));
}
