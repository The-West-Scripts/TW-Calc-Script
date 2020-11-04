import 'core-js/features/set/map';
// expose Map polyfill to the global scope
// explanation in rollup.config.js
window['_Map'] = Map;
