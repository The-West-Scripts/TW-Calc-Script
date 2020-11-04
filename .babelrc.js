const { ENV = 'dev' } = process.env;

module.exports = api => {
    // TODO: configure .babelrc caching
    api.cache(false);

    const presets = [['@babel/preset-env', { targets: '> 0.5%, not dead', ...getPresetEnvConfig(ENV) }]];
    const plugins = [
        ['@babel/plugin-transform-runtime', getTransformRuntimeConfig(ENV)],
        ['search-and-replace', { rules: getSearchAndReplaceRules() }],
    ];

    return {
        presets,
        plugins,
    };
};

/**
 * Build @babel/preset-env config based on the current environment.
 */
function getPresetEnvConfig(env) {
    if (env === 'test') {
        return {
            corejs: 3,
            useBuiltIns: 'usage',
        };
    } else {
        return {
            useBuiltIns: false,
        };
    }
}

function getSearchAndReplaceRules() {
    const { version, author, contributors } = require('./package.json');

    const values = {
        VERSION: version,
        AUTHOR: author,
        CONTRIBUTORS: contributors.join(', '),
        ENV,
    };

    return Object.keys(values).map(key => ({
        search: RegExp(`<@${key}@>`),
        replace: values[key],
    }));
}

function getTransformRuntimeConfig(env) {
    if (env === 'test') {
        return {
            corejs: false,
        };
    } else {
        return {
            corejs: 3,
            proposals: true,
        };
    }
}
