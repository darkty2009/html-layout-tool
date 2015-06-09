(function(define) {
    define(function (require, exports, module) {
        return {
            output:"demo/output",
            files:[
                'demo/*.html'
            ],
            engine:{
                layout:"<?php include(\"$1\"); ?>",
                if_start:"<?php if($1) { ?>",
                if_end:"<?php } ?>",
                for_start:"<?php foreach($1 as $2) { ?>",
                for_end:"<?php } ?>",
                vars:"<?php echo $1; ?>"
            }
        };
    });

}(
    typeof module === 'object' && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, exports, module); }
    : define
));