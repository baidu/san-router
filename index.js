/**
 * san-router
 * Copyright 2017 Baidu Inc. All rights reserved.
 */

(function (root) {

    var main = {

    };

    // For AMD
    if (typeof define === 'function' && define.amd) {
        define('san-router', [], main);
    }
    else {
        root.sanRouter = main;
    }


})(this);
