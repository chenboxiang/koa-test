(function() {
    // copy from https://github.com/seajs/seajs/issues/264#issuecomment-20719662
    var TIME_STAMP = "?t=" + new Date().getTime()

    seajs.on("fetch", function(data) {
        if (data.uri) {
            data.requestUri = data.uri + TIME_STAMP
        }
    })

    seajs.on("define", function(data) {
        if (data.uri) {
            data.uri = data.uri.replace(TIME_STAMP, "")
        }
    })
    define("chenboxiang/seajs-nocache/1.0.0/seajs-nocache-debug", [], {});
})();