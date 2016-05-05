exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var babelCore = require('babel-core');

exports.getLocations = function () {
    return [
        {
            // All source and spec files
            key: 'source',
            location: /^\/src\/.+\.js/,
            handler: [
                babel({ast: 'inline'}, {babel: babelCore})
            ]
        },
        {
            // All source and spec files
            location: /(src|spec)\/.+\.js/,
            handler: [
                babel({}, {babel: babelCore})
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
