(function() {
    define("init", function (require, exports, module) {
        require("lib/baseline");
        require("lib/jquery.js");

        require("main");
    });

    seajs.use("init");
})();