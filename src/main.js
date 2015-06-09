(function(define) {
    define(function (require, exports, module) {
        var const_config = require("const");

        var cacheTemplate = {};
        var headTemplate = {};

        var createModule = require("module");

        function formatPage() {
            var html = $('html');
            var result = html.html().replace(const_config.reg_layout, function(match, key, index, srcString) {
                var data = formatData(match);
                return cacheTemplate[data.src].format();
            });

            var tempDom = $(result);
            if(tempDom.find('head').length) {
                var headHtml = tempDom.find('head').outerHtml();
                tempDom.find('head').remove();
                result = tempDom.outerHtml();

                $('head').html(headHtml);
            }

            $('body').html(result);

//		    for(var key in headTemplate) {
//			    document.getElementsByTagName("head")[0].innerHTML = headTemplate[key];
//			    delete headTemplate[key];
//		    }
        }

        function checkAllLayout() {
            var flag = true;
            for(var key in cacheTemplate) {
                if(!cacheTemplate[key].status) {
                    flag = false;
                    break;
                }
            }

            if(flag) {
                var html = document.getElementsByTagName("html")[0];
                html = html.innerHTML;
                var overLayout = html.match(const_config.reg_layout);
                while (overLayout) {
                    formatPage();
                    var html = document.getElementsByTagName("html")[0];
                    html = html.innerHTML;
                    overLayout = html.match(const_config.reg_layout);
                }
            }
        }

        function formatData(layout) {
            var data = {};
//            var tempLayout = layout.split(" ");
//            for(var i=0;i<tempLayout.length;i++) {
//                var re = const_config.reg_attr.exec(tempLayout[i]);
//                if(re.key && re.value) {
//                    data[re.key] = re.value;
//                }
//            }
            var result = const_config.reg_attr.execl(layout);
            result && result.forEach(function(item) {
                data[item.key] = item.value;
            });

            return data;
        }

        function parseLayout(layout, callback) {
            var data = formatData(layout);

            cacheTemplate[data.src] = createModule(layout, data.src);
            cacheTemplate[data.src].data = data;

            console.log(data);

            $.ajax({
                type:"GET",
                dataType:"html",
                url:data.src + "?t=" + Math.random(),
                success:function(response) {
                    if(response) {
                        cacheTemplate[data.src].result = response;
                        cacheTemplate[data.src].status = 1;

//					if(response.indexOf('<head>') >= 0) {
//						headTemplate[layout] = response.replace('<head>', '').replace('</head>', '');
//					}

                        var hasLayout = response.match(const_config.reg_layout);
                        if(hasLayout && hasLayout.length > 0) {
                            cacheTemplate[data.src].depend = hasLayout;
                            for(var i=0;i<hasLayout.length;i++) {
                                parseLayout(hasLayout[i], checkAllLayout);
                            }
                        }else {
                            if(callback) {
                                callback();
                            }
                        }
                    }
                },
                error:function(response) {
                    console.log(response);
                }
            });
        }

        var html = document.getElementsByTagName("html")[0];
        html = html.innerHTML;

        var result = html.match(const_config.reg_layout);
        result && result.forEach(function(item, index) {
            (function() {
                parseLayout(item, checkAllLayout);
            })();
        });
    });

}(
    typeof module === 'object' && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));