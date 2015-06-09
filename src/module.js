(function(define) {
    define(function (require, exports, module) {
        var const_config = require("const");

        return function(source, name) {
            var module = {};
            module.name = name;
            module.status = 0;
            module.data = null;
            module.source = source;
            module.format = function() {
                var result = module.result;
                result = result.replace(/(\r|\n)*/ig, "");

                // 解析 for
                var allFor = result.match(/<for[^\>]*\>.*?<\/for>/ig);
                for(var m=0;allFor && m<allFor.length;m++) {
                    var forData = const_config.reg_for.exec(allFor[m]);
                    if (forData.head) {
                        var allData = forData.head.match(/[^\s]+=['"][^\s]*['"]/ig);
                        var dataMap = {};
                        for(var d=0;allData && d<allData.length;d++) {
                            var data = const_config.reg_attr.exec(allData[d]);
                            dataMap[data.key] = data.value;
                        }

                        if (dataMap.from && forData.content) {
                            var replaceData = module.data[dataMap.from];
                            if(replaceData) {
                                replaceData = replaceData.split(",");
                            }
                            else if(dataMap.from.indexOf('[') == 0) {
                                replaceData = eval(dataMap.from);
                            }

                            var forHtml = [];
                            for(var i=0;i<replaceData.length;i++) {
                                var itemHtml = forData.content.replace(/\$data\!/ig, replaceData[i]);
                                forHtml.push(itemHtml);
                            }

                            result = result.replace(allFor[m], forHtml.join(""));
                        }
                        if(dataMap.mod) {
                            var modData = const_config.reg_mod.exec(dataMap.mod);
                            var modIndex = -1;
                            result = result.replace(/\$mod\!/ig, function(match, f1, index, srcStr) {
                                modIndex++;
                                if(modIndex % modData.mod*1 == modData.result*1) {
                                    return modData.output;
                                }else {
                                    return "";
                                }
                            });
                        }
                    }
                }

                for(var key in module.data) {
                    var reg = new RegExp("\\{\\$"+key+"\\}", "ig");
                    result = result.replace(reg, module.data[key]);
                }

                // 解析if
                var allIf = result.match(/<if[^\>]*\>.*?<\/if>/ig);
                for(var i=0;allIf && i<allIf.length;i++) {
                    var ifData = const_config.reg_if.exec(allIf[i]);
                    if(ifData.head) {
                        var allData = ifData.head.match(/[^\s]+=['"][^\s]*['"]/ig);
                        var dataMap = {};
                        for(var d=0;allData && d<allData.length;d++) {
                            var data = const_config.reg_attr.exec(allData[d]);
                            dataMap[data.key] = data.value;
                        }

                        if(dataMap.cond) {
                            var condition = eval('('+dataMap.cond+')');
                            if(condition) {
                                result = result.replace(allIf[i], ifData.content);
                            }else {
                                result = result.replace(allIf[i], '');
                            }
                        }
                    }
                }

                if(result.indexOf('<head>') >= 0) {
//				headTemplate[module.source] = result.replace('<head>', '').replace('</head>', '');
//				result = "";
                }

                return result;
            };

            return module;
        }
    });

}(
    typeof module === 'object' && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));