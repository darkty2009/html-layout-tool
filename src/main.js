(function(define) {
    define(function (require, exports, module) {
        var const_config = require("const");

        var cacheTemplate = {};
        var headTemplate = {};

        var createModule = require("module");

        function replaceLayout(match, key, index, srcString) {
            var data = formatData(match);
            // 根据二次解析后的内容设置替换变量的值
            if(cacheTemplate[data.src]) {
                cacheTemplate[data.src].data = data;
                return cacheTemplate[data.src].format();
            }else {
                return "";
            }
        }

        function formatPage() {
            var html = $('html');

            var head = html.find('head');
            var body = html.find('body');
            head.html(head.html().replace(const_config.reg_layout, replaceLayout));
            body.html(body.html().replace(const_config.reg_layout, replaceLayout));

            // 让head和body外的模板直接插入到body中
            if(html.find('>layout').length) {
                var outerLayoutHtml = html.find('>layout').reduce(function(prep, item) {
                    return (prep||"")+$(item).outerHTML();
                });
                var outerLayout = outerLayoutHtml.match(const_config.reg_layout);
                if (outerLayout && outerLayout.length) {
                    outerLayout.map(replaceLayout);
                    body.append(outerLayout.join(""));
                }
            }
//            html.html(html.html().replace(const_config.reg_layout, replaceLayout));

//            var tempDom = $(result);
//            if(tempDom.find('head').length) {
//                var headHtml = tempDom.find('head').outerHtml();
//                tempDom.find('head').remove();
//                result = tempDom.outerHtml();
//
//                $('head').html(headHtml);
//            }

//            $('html').html(result);

//		    for(var key in headTemplate) {
//			    document.getElementsByTagName("head")[0].innerHTML = headTemplate[key];
//			    delete headTemplate[key];
//		    }
        }

        function checkAllLayout() {
            var flag = true;
            var needRender = false;
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

                if(overLayout) {
                    needRender = true;
                }

                while (overLayout) {
                    formatPage();
                    var html = document.getElementsByTagName("html")[0];
                    html = html.innerHTML;
                    overLayout = html.match(const_config.reg_layout);
                }
            }

            return needRender;
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

            if(data && data.src) {
                cacheTemplate[data.src] = createModule(layout, data.src);
                cacheTemplate[data.src].data = data;

                $.ajax({
                    type: "GET",
                    dataType: "html",
                    url: data.src + "?t=" + Math.random(),
                    success: function (response) {
                        if (response) {
                            cacheTemplate[data.src].result = response;
                            cacheTemplate[data.src].status = 1;

                            //					if(response.indexOf('<head>') >= 0) {
                            //						headTemplate[layout] = response.replace('<head>', '').replace('</head>', '');
                            //					}

                            var hasLayout = response.match(const_config.reg_layout);
                            if (hasLayout && hasLayout.length > 0) {
                                cacheTemplate[data.src].depend = hasLayout;
                                for (var i = 0; i < hasLayout.length; i++) {
                                    parseLayout(hasLayout[i], checkAllLayout);
                                }
                            } else {
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
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