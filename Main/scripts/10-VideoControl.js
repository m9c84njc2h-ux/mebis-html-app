var VideoControl = 
    (function() {

         function VideoControl (options) {
             Tools.optionHash(
                 options, 
                 {
                     play:$('#videoPlay'), pause:$('#videoPause'),
                     rewind:$('#videoRewind'), element: $(),
                     seekHack: true
                 }
             );
             
             this.options = options;
             this.controls = options.play.add(options.pause).add(options.rewind).add(options.element);
             this.elem$ = options.element;
             this.videos = [];
             this.videos$ = $();
             this.renderSlider();
             this.timeout = null;

             this.duration = null;
             this.dragging = false;
             this.playing = false;
         }
         
         VideoControl.prototype = {
             tSlider : function( tVideo ) {
                 return Math.min(tVideo/this.videos[0].prop('duration')*100, 100);
             },
             tVideo : function( tSlider ) {
                 return (this.videos[0].prop('duration')/100 * tSlider);
             },
             ready : function() {
                 var allReady = true;
                 for (var i = 0; i<this.videos.length; i++)
                     allReady = allReady && this.videos[i].prop('readyState');
                 return allReady;
             },
             seekTo : function(tVideo) {
                 var video, duration;
                 for (var i = 0; i< this.videos.length; i++) {
                     video = this.videos[i];
                     duration = video.prop('duration');
                     video.prop('currentTime', Math.min(tVideo, duration));
                 }
             },
             pause : function() {
                 this.videos$.each(
                     function(idx, vid) {
                         vid.pause();
                     });
             },
             
             play : function() {

                 this.videos$.each(
                     function(idx, vid) {
                         //console.log('playing');
                         vid.play();
                     });
             },
             
             setSlider : function(tVideo) {
                 this.elem$.slider('value', this.tSlider(tVideo));
             },
             renderSlider : function() {
                 var thisp=this;
                 this.thispCheckTimes = function() {thisp.checkTimes();};
                 this.elem$.slider(
                     {
			 range: "min",
			 value: 0,
			 min: 0,
			 max: 100,
			 slide: function( event, ui ) {
                             var val = thisp.tVideo(ui.value);
                             thisp.seekTo(val);
			 },
                         start: function() { 
                             thisp.dragging = true; 

                             thisp.wasPlaying = thisp.playing;
                             if (thisp.playing)
                                 thisp.pause();
                         },
                         stop: function() { 
                             thisp.dragging = false;
                             thisp.pause();
                                 
                         }
		     }
                 );

                 this.updateSlider = function() { 
                     if (!thisp.dragging)
                         thisp.setSlider(thisp.videos[0].prop('currentTime'));
                 };
                 this.played = function() {
                     //thisp.options.play.add3Class('active');
                     //thisp.options.pause.remove3Class('active');
                     thisp.playing = true;
                 };

                 this.paused = function() { 
                     var time = thisp.videos[0].prop('currentTime');
                     if (time > 0  && time < this.duration)
                         //thisp.options.pause.add3Class('active');
                         

                     //thisp.options.play.remove3Class('active');
                     thisp.playing = false;
                 };

                 this.ended = function() { 
                     thisp.pause();
                     //thisp.options.play.remove3Class('active');
                     //thisp.options.pause.remove3Class('active');
                 };
                 this.detach();

             },
             checkTimes : function() {

                 var timeoffset = 0;
                 var first = this.videos[0].prop('currentTiime');
                 var offsetThreshold = 0.1;
                 for (var i = 1; i<this.videos.length; i++) {
                     timeoffset += Math.abs(first-this.videos[i].prop('currentTiime'));
                 }
                 if (timeoffset > offsetThreshold) {
                     this.seekTo(first);
                     //console.log('not quite');
                     window.setTimeout(this.thispCheckTimes, 3000);
                 } else {
                     window.setTimeout(this.thispCheckTimes, 500);
                 }
             },


             attach : function(video) {
                 this.videos.push(video);
                 this.videos$ = this.videos$.add(video);
                 video.prop('controls',false);
                 video.get(0).pause(0);
                 //console.log('attaching '+video.length+' videos');
                 this.setup(video, this.videos.length-1);
                 this.paused();

             },
             setup: function(video, idx) {
                 /*  
                  * TODO:  THIS ISSUE NEEDS FURTHER RESEARCH.
                  * 
                  * This section makes sure that javascript-based
                  * video element interaction does not take place
                  * before the element is ready.  It was temporarily
                  * commented out so as to work around a Safari bug on
                  * iOS, which inturn broke some modules, so merely
                  * commenting it out it is not an option.
                  * 
                  * 
                  * (http://stackoverflow.com/questions/11633929/readystate-issue-with-html5-video-elements-on-ios-safari)
                  */
                 if (!this.ready()) {
                     var thisp = this;
                     window.setTimeout(function() { thisp.setup(video, idx);}, 300);
                     //console.log('retrying');
                     return;
                 }
                 


                 if (idx == 0) {
                     this.elem$.slider('enable').addClass('enabled');
                     this.controls.removeClass('disabled');
                     video.bind('timeupdate.videocontrols', this.updateSlider);
                     video.bind('play.videocontrols', this.played);
                     video.bind('pause.videocontrols', this.paused);
                     video.bind('ended.videocontrols', this.ended);

                     // HACK: IE and Safari initially do not render
                     // show the video (although it should be
                     // visibile).  Double-Seeking the video to
                     // position 1 and back to 0 makes
                     // the video visible.
                     //
                     // But we must not seek in any situation (it's
                     // actually the module's job to
                     // manage the video state, and some actually do
                     // e.g. seek to the end after attaching the
                     // video), therefore we only
                     // double-seek if the video has not been touched
                     // before.
                     //
                     // TODO: Implement a VideoSlide class which
                     // manages the video and remove the stuff below.
                     
                     // Do not apply seek hack if options.seekHack is set to false
                     video.data('zeroseek', !this.options.seekHack);
                         
                     if (false && !video.data('zeroseek')){
                         
                         function rewind() {
                             video.get(0).currentTime = 0;
                             var a = video.get(0).currentTime;
                             //console.log('currentTime '+a);
                             if (a != 0)
                                 window.setTimeout(rewind,50);
                         }
                         video.get(0).currentTime = 1/23;
                         window.setTimeout(rewind,50);

                         //console.log('seeking to zero');
                         video.data('zeroseek', true);

                     }
                         
                     
                     var thisp=this;
                     this.options.play.bind('click.videocontrols', function() { thisp.videos$.each(function(idx, vid) { vid.play(); });});
                     this.options.pause.bind('click.videocontrols', function() { thisp.videos$.each(function(idx, vid) { vid.pause(); });});
                     this.options.rewind.bind('click.videocontrols', function() { thisp.videos$.each(function(idx, vid) 
                     	{
                     	//thisp.options.pause.remove3Class('active');
                     	 vid.currentTime= 0;vid.pause();
                     	 });});  
                 } else {
                     video.get(0).currentTime = Math.min(video.prop('duration'), this.videos[0].prop('currentTime'));
                     if (this.playing)
                         video.get(0).play();
                     else 
                         video.get(0).pause();
                 }

                 // window.setTimeout(this.thispCheckTimes, 500);
                 //console.log('ready setting up');
             },
             detach : function() {
                 this.elem$.slider('disable');
                 /*this.controls.addClass('disabled');*/
                 this.playing = false;

                 if (this.videos.length > 0) {
                     this.elem$.slider('value', 0);
                     this.videos[0].unbind('.videocontrols');

                     this.options.play.unbind('.videocontrols');
                     this.options.pause.unbind('.videocontrols');
                     this.options.rewind.unbind('.videocontrols');
                     this.videos = [];
                     this.videos$ = $();
                     //this.options.play.remove3Class('active');
                     //this.options.pause.remove3Class('active');

                 }
             }
             
         };
         return VideoControl;
     })();
