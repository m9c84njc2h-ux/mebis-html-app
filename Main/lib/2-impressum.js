$(document).ready(
    function()
    {
        var src = "Main/images/layout/btn-impressum.png";
        var hoverSrc = "Main/images/layout/btn-impressum-hover.png";
        var visibility;

        // As a result of our approach to no script warning, the
        // impressum is active when the page is loaded.  If javascript
        // is enabled, it will eventually pass this point and render
        // the impressum inactive.
        $('#mediainfo-container').removeClass('impressum-active');

        $("#info, .div2").click(
            // toggle impressum window visibility
            function(event)
            {
                $('#mediainfo-container').toggleClass('impressum-active');
                visibility = ($("#infoContainer").css("visibility") == "hidden") ? 'visible' : 'hidden';
                $("#infoContainer").css("visibility",visibility);

                src = (src == "Main/images/layout/btn-impressum.png") ? "Main/images/layout/btn-impressum-hover.png" : "Main/images/layout/btn-impressum.png";
                hoverSrc = (hoverSrc == "Main/images/layout/btn-impressum-hover.png") ? "Main/images/layout/btn-impressum.png" : "Main/images/layout/btn-impressum-hover.png";

                if(visibility == "hidden") $("#info").attr("src", src);
            }
        );

        $("#info").hover(
            function () {$(this).attr("src", hoverSrc);}, 
            function () {$(this).attr("src", src);}
        );


        $("#impressum, #medienquellen, #systemvoraussetzung").click(
            function(event)
            {
                $('#infoNavigation li').removeClass("selected");
                $('#'+this.id).addClass("selected");
                $("#content-impressum, #content-medienquellen, #content-systemvoraussetzung").css("display","none");
                $('#content-'+this.id).css("display","block");
            }
        );


    }
);

