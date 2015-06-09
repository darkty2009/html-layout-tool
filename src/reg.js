(function(define) {
    define(function (require, exports, module) {
        var Reg = function(regstr, pattern) {
            var self = this;
            self._quene = [];

            self._regexp = null;

            self._source = null;

            self._pattern = "";

            self._last = null;

            self.initialize = function(regstr, pattern) {
                self._pattern = pattern;
                self._parse(regstr);
                return self;
            };

            self._parse = function(str) {
                self._source = str;

                var regsource = str.source;

                var treg = /\#<.*?\)>/ig;
                treg = regsource.match(treg);

                var ireg = /\#<([a-zA-Z0-9_-]+)=(\(.*\))>/;
                self._quene = [];
                for(var i=0;i<treg.length;i++) {
                    var result = treg[i].match(ireg);
                    var map = {
                        key:result[1],
                        reg:result[2],
                        source:result[0]
                    };
                    self._quene.push(map);
                }

                self._buildRegExp();
            };


            self._buildRegExp = function() {
                self._regexp = self._source.source;
                for(var i=0;i<self._quene.length;i++) {
                    self._regexp = self._regexp.replace(self._quene[i].source, self._quene[i].reg);
                }

                self._regexp = new RegExp(self._regexp, self._pattern);
            };

            self.exec = function(data, index) {
                var result = data.substring(index).match(self._regexp);
                self._last = result;
                var re = {};
                if(result) {
                    for(var i=0;i<self._quene.length;i++) {
                        if(result[i+1]) {
                            re[self._quene[i].key] = result[i+1];
                        }
                    }
                    return re;
                }

                return null;
            };

            self.execl = function(data) {
                var index = 0;
                var result = [];
                while(index < data.length) {
                    var item = self.exec(data, index);
                    if(item && self._last) {
                        result.push(item);
                        index += data.indexOf(self._last[0], index) + self._last[0].length;
                    }else {
                        index = data.length;
                    }
                }

                return result;
            }

            self.test = function(data) {
                return self._regexp.test(data);
            };

            return self.initialize(regstr, pattern);
        };

        return Reg;
    });

}(
    typeof module === 'object' && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));