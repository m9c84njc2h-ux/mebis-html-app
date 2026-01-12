// the code base assumes console.log to be a function
if (typeof console != "object") {
    var surrogate = {};
    console = surrogate;
} 

if (typeof console.log != "function")
    console.log = function() {};


 




// jquery plugin definitions

$.fn.fixMinHeight = function(minHeight) {
    if (this.length == 0)
        return;

    if (this.height() <= minHeight)
        this.height(minHeight);
};


// 3-State button functions.
(function($) {


     function d(obj) {
//         console.log(obj);
     }
     var UNCERTAIN=0, OVER=1,MOUSE_OVER=1, OUT=2,MOUSE_OUT=2, ON=true, OFF=false;

     function State( /*mouse, activeState, closing*/) {
         // mouse: 0 = uncertain, 1=over, 2=out
         this.mouse = 0;
         this.active = false;
         this.closing = false;
         
         if (arguments.length >= 2) {
             this.mouse = arguments[0];
             this.active = arguments[1];
         }
         if (arguments.length > 2)
             this.closing = arguments[2];
     }
     State.prototype = {
         withMouse: function(mouse) {
             return new State(mouse, this.active);
         },
         withActivity: function(activity) {
             return new State(this.mouse, activity);
         },
         withActivityToggled: function() {
             return this.withActivity(this.active ? OFF : ON);
         },
         isOn: function() {
             return this.active; 
         },
         mouseIs: function(mouseState) {
             return this.mouse == mouseState;
         },
         isClosing: function() {
             return this.closing;
         },
         toString: function() {
             var suffix = "";

             if (this.isClosing())
                 suffix = '(closing)';

             return (this.active ? 'ON_' : 'OFF_') + ['UNCERTAIN', 'MOUSE_OVER', 'MOUSE_OUT'][this.mouse] + suffix;
         },
         equals: function(state) {
             return this.mouse == state.mouse && 
                 this.active == state.active && 
                 this.closing == state.closing;
         }
     };
     
     function FSM($, cls){
         this.cls = cls;
         this.$ = $;
         this.state = new State();

         this.evAll = '.' +cls;
         this.evMOut = 'mouseout.'+cls;
         this.evMOver = 'mouseover.'+cls;
         this.currentClass = "";

         var thisp = this;
         this.$.bind(this.evMOut, 
                     function() {
                         d('Mouseout');
                         thisp.mouseOut();
                     });
         this.$.bind(this.evMOver, 
                     function() {
                         d('Mouseover');
                         thisp.mouseOver();
                     });

     }
     FSM.get = function($, cls){
         var fsm;
         if ((fsm = $.data('tggl3State'+cls)))
             return fsm;
         fsm = new FSM($, cls);
         $.data('tggl3State'+cls, fsm);
         return fsm;
     };
     FSM.prototype = {
         get : function() {
             return this.state;
         },
         enter: function(state){
             d('Entering state '+state);
             if (state.equals(this.state))
                 return;
             this.cleanUp(state);
             this.setup(state);
             this.done(state);
         },
         cleanUp: function(state) {
             this.doRemoveClass(state);
         },
         doRemoveClass: function(nextState) {
             if (this.currentClass && this.currentClass != this.cssClass(nextState)) {
                 this.$.removeClass(this.currentClass);
                 d('removing class:'+this.currentClass);
             }
         },
         doAddClass: function() {
             var newClass = this.cssClass(this.state);
             if (newClass == "")
                 return;

             if (this.currentClass != newClass)
                 d('new class: '+ newClass);

             this.currentClass = newClass;
             this.$.addClass(this.currentClass);
         },
         cssClass: function(state) {
             var suffix = "";
             if (state.isClosing())
                 suffix = "Closing";
             else if (state.isOn())
                 suffix ="On";
             else
                 return "";

             return this.cls+suffix;
         },
         isPreClosing: function() {
             return this.state.isOn() && !this.state.mouseIs(OUT);
         },
         setup: function(state) {
         },
         setupEvMOut: function() {
         },
         mouseOver: function() {
             this.enter(this.state.withMouse(OVER));
         },
         mouseOut: function() {
             this.enter(this.state.withMouse(OUT));
         },
         done: function(state) {
             this.state = state;
             this.doAddClass();
         },

         scriptInput: function(input) {
             d(input);
             this[input]();
         },

         addClass : function() {
             this.enter(this.state.withActivity(ON));
         },

         toggleClass : function() {
             this.enter(this.isPreClosing() ? new State(this.state.mouse, OFF, true): this.state.withActivityToggled());
         },
         removeClass: function() {
             this.enter(this.isPreClosing() ? new State(this.state.mouse, OFF, true) : this.state.withActivity(OFF));
         }
     };

     $.fn.add3Class = function(cls) {
         var m = FSM.get(this, cls);
         m.scriptInput('addClass');
         return this;
     };

     $.fn.toggle3Class = function(cls) {
         var m = FSM.get(this, cls);
         m.scriptInput('toggleClass');
         return this;
     };

     $.fn.remove3Class = function(cls) {
         var m = FSM.get(this, cls);
         m.scriptInput('removeClass');
         return this;
     };
     
})($);


goog.provide('klett.Console');
goog.provide('klett.module');


// HACK:
//
// Because this uses the ov-library, we've put a link to 10-min-ov.js
// in the lib/ dir.  This is not how dependencies should be managed.
// For instance, when the ov lib changes, this template will not
// receive those changes (no automatic recompilation of 10-min-ov.js).
//
// As of now, the correct way would be to document the dependency
// (ov-lib) in templates/base/dependencies.  But that would force us
// to reference ov-lib in EVERY build-info file.
// 
// We should put in place a dependency management scheme, which allows
// us to state dependencies inline, like so:
//
//    goog.require('klett.ov');
//
// And so (by means of a dependency file)
//   
//     template/example/includes:
//         ## Specifies the templates which are loaded automatically
//
//         ov-lib
//         ...
//
//
//


(function() {
    var /* klett.Console shorthand */ Console = 
        function(containers, buttons, minHeight) {
            var slides = [new OverlaySlide({element:$(), text:''})];
            var slideState = [];
            var idx=0;

            // takes care of `selected` state 
            var lastSelectedButton = buttons[0];
            var thisp = this;
            containers.forEach(
                function(slide){
                    var i = idx;
                    var b = buttons[idx];
                    slide.children('.min-height-fix').data('Console.slideNumber', i+1);
                    slideState[i] = false;
                    slides.push(new OverlaySlide(
                        {
                            element:slide, 
                            onEnter:function(){
                                lastSelectedButton.removeClass('selected');
                                lastSelectedButton = b;
                                b.addClass('visible'); slideState[i] = true;
                                b.addClass('selected');
                                // HACK:
                                //
                                // Setting the height dynamically serves two
                                // purposes with the two-coloumn layout, which
                                // could not be achieved with static css
                                // declarations allone.
                                //
                                // - Minimum container height.
                                //
                                //   While the mediainfo container should have
                                //   a minimum height (of currently about
                                //   98px), the css property min-height is
                                //   either not suitable or not honoured by
                                //   Google Chrome (if the text doesn't fit,
                                //   it restricts the height to that minimum
                                //   height and adds more columns instead)
                                //
                                // - Avoid balanced column fill in situations
                                //   with little text.
                                //
                                //   Firefox tries to balance the columns,
                                //   even if ther is enough space to fill the
                                //   left-hand column first.
                                //
                                // The current fix works by leaving the
                                // container without any height definition.
                                // Only if the current height is less than
                                // what the minimum height should be, the line
                                // below sets the height property to that
                                // minimum value.
                                //   
                                // This fix assumes that any
                                // modification of mediainfo
                                // containers will be made through
                                // klett.Console.changeContainer()

                                thisp.fixHeight(this.element);
                            }, 
                            onLeave:function(){
                                b.removeClass('visible'); slideState[i] = false; 
                                thisp.unfixHeight(this.element);
                            } 
                        })
                               );
                    b.click(
                        function(){
                            slideState[i] = ! slideState[i];
                            thisp.ov.goToSlide( slideState[i] ? i+1 : 0);
                        });
                    idx++;
                }
            );

            this.ov = new OverlayController (
                [new OverlayChapter(slides,{})],{});
            this.ov.goToSlide(1);
            Console.singelton = this;
        };

    Console.changeContainer = function(elem$, innerHTML) {
        var idx = elem$.data('Console.slideNumber');
        var thisp,parent;
        if (idx > 0) {
            thisp = Console.singelton;
            parent = thisp.ov.model.get(idx).element;

            thisp.unfixHeight(parent);
        }
        elem$.html(innerHTML);

        if (idx > 0)
            thisp.fixHeight(parent);
        

    };

    Console.prototype = {
        unfixHeight : function(element) {
            if (klett.settings.layout.style.minHeightFixEnabled)
                element.children('.min-height-fix').css('height','auto');
        },
        fixHeight : function(element) {
            if (klett.settings.layout.style.minHeightFixEnabled)
                element.children('.min-height-fix').
                fixMinHeight(klett.settings.layout.style.mediainfoContainerInnerHeight);
        }
    };

    klett.Console = Console;
})();


klett.module = {
    events : Tools.defaultEventSubscription(['Reset', 'ModuleLoaded']),
    reset: function() { 
        location.reload(); 
    },
    startBusyState : function(progressBar) {
        $('#loadscreen').addClass('aspect-' + (progressBar ? 'progress-bar' : 'indicator')).show();
        if (progressBar)
            $('#startup-progress-bar').progressbar({ value:0 });
            
    },
    stopBusyState : function() {
        $('#loadscreen').hide();
    },

    notifyLoadState : function(state) {
        $('#startup-progress-bar').progressbar('option', 'value', state*100);
    },
    notifyModuleLoaded: function() {
        this.events.fire('ModuleLoaded');
    },

    addListener: function(listener) {
        this.events.addListener(listener);
    }
};
