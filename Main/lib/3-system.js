$(document).ready(
    function() {
        var errs=$('.template-error');
        errs.hover(
            function() {$(this).animate({opacity:0.1},200);} ,
            function() {$(this).animate({opacity:1},200);}
        );
        errs.css({position:'absolute'}).each(
            function(idx, elem) {
                $(elem).offset($(elem).offset());
            }
        );

    }
);