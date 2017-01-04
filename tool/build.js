var babel = require("babel-core");

babel.transformFile(
    "src/main.js",
    {
        presets: ['es2015', 'es2016'],
        plugins: ['transform-es2015-modules-umd']
    },
    function(err, result) {
        console.log(result)
    }
);
