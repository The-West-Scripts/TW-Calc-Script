module.exports = api => {
    // TODO: configure caching
    api.cache(false);

    const presets = [['minify'], ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }]];
    const plugins = [
        ['@babel/plugin-transform-runtime'],
        ['@babel/plugin-transform-typescript', { sourceMap: false }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties'],
    ];

    return {
        presets,
        plugins,
    };
};
