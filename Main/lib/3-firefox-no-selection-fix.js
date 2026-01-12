$(document).ready(
    function() {
        var p = $('.selection-enabled');
        while (p.length >0) { 
            p=p.parent(); 
            p.addClass('selection-enabled'); 
        }
    }
);