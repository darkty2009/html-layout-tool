(function(define) {
    define(function (require, exports, module) {
        var Reg = require("reg");
        return {
            reg_layout:/<layout[a-zA-Z0-9"'=/.\s,-_\{\}\$\uff01-\uff5e ]*?><\/layout>/ig,
            reg_attr:new Reg(/#<key=([^\s]+)>=['"]#<value=([a-zA-Z0-9"'=/.\s,-_\{\}\$\uff01-\uff5e ]*?)>['"]/),
            reg_for:new Reg(/#<head=(<for[^\>]*\>)>#<content=(.*?)><\/for>/),
            reg_mod:new Reg(/#<mod=(\d+)>,#<result=(\d+)>,#<output=(.*)>/),
            reg_if:new Reg(/#<head=(<if[^\>]*\>)>#<content=(.*?)><\/if>/)
        };
    });

}(
    typeof module === 'object' && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));