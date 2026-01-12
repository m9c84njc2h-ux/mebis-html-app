Tools = (
    function () {

        function ChainingParameters(f, firstArg, argNames, pthis) {
            var bound = 0, bindings = [firstArg], length = argNames.length;
            var thisp = this, name;
            for (var i=0; i< length; i++){
                this[argNames[i]] = (function(i){
                    return function(param){
                        if (bindings[i] === undefined)
                            bound++;

                        bindings[i] = param;
                        if (bound < length)
                            return thisp;

                        return f.apply(pthis, bindings);
                    };
                })(
                    i+1
                    /* +1 because the first argumend is bound to firstArg */
                );
            }
        }

        function chainableFunction(f, argNames, thisp) {
            return function(param) { 
                return new ChainingParameters(f, param, argNames, thisp);
            }
        }

        function defaultEventSubscription(events) 
        /**
         *  Usage example :
         * 
         *        var pubSub = Tools.defaultEventSubscription(['Event1', 'Event2']);
         *        pubSub.addlistener(
         *            { 
         *                notifyEvent1 : function(obj) { 
         *                    console.log('Event1'); 
         *                    console.log(obj); 
         *                }, 
         *                notifyEvent2 : function(obj) { 
         *                    console.log('Event2'); 
         *                }
         *            }
         *        );
         *        pubSub.fire('Event1', 'test');
         */
        {


            var listeners = [];
            return { 
                removeListener: function(listener) {
                    var idx = listeners.indexOf(listener);
                    if ( idx < 0 )
                        throw("No such listener");
                    listeners.splice(idx, 1);
                },
                addListener : function(listener) {
                    if (listener instanceof Function) {
                        listeners.push(listener);
                        return;
                    }
                    if (! events.forEach(
                            function(e) { 
                                if (! ('notify'+e in listener && 
                                       listener['notify'+e] instanceof Function ) )
                                    throw('Listener '+listener+' lacks event handling routine notify'+e);
                            }));
                        
                    listeners.push(listener);
                },
                
                fire : function(event, obj) {
                    if (events.indexOf(event) < 0 )
                        throw("No such event");

                    listeners.forEach(
                        function(listener) {
                            if (listener instanceof Function)
                                listener(event, obj);
                            else
                                listener['notify'+event](obj);                   
                        });
                        
                }
            };
        }
        function everyIn(obj, type, fun) {
            var every = true;
            for (var key in obj) {
                var element = obj[key];
                if (element instanceof type)
                    every = every && fun(element);;
            }
            return every;
        }
        function spaceEvenly (element$) {
            
            var width=element$.innerWidth();
            var children = element$.children();

            var sum = 0;
            children.css({position:'absolute'}).each(
                function(index, domelement) {
                    domelement = $(domelement);
                    var nextWidth =
                        Math.floor( 
                            index < children.length - 1 ? width/children.length : width - sum
                        );

                    domelement.css({left: sum + (index == 0 ? 0 : -1), top:0});
                    domelement.width(nextWidth);
                    var actualWidth = domelement.outerWidth();
                    domelement.width(2*nextWidth-actualWidth+1);
                    sum += nextWidth;
                });
            
        }
        // generates jquery set based on the selectors contained in the arr
        function $arr (arr) {
            return arr.reduce(
                function(prev, cur, idx, arr) {
                    return prev.add($(cur));
                }, $());
        }
        function jqToString(jq) {
            return 'id='+jq.attr('id')+', class='+jq.attr('class');
        }


        // from developer.mozilla.org
        function forEach( callback, thisArg ) {  
            
            var T, k;  
            
            if ( this == null ) {  
                throw new TypeError( " this is null or not defined" );  
            }  
            
            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
            var O = Object(this);  
            
            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".  
            // 3. Let len be ToUint32(lenValue).  
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32  
            
            // 4. If IsCallable(callback) is false, throw a TypeError exception.  
            // See: http://es5.github.com/#x9.11  
            if ( {}.toString.call(callback) != "[object Function]" ) {  
                throw new TypeError( callback + " is not a function" );  
            }  
            
            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  
            if ( thisArg ) {  
                T = thisArg;  
            }  
            
            // 6. Let k be 0  
            k = 0;  
            
            // 7. Repeat, while k < len  
            while( k < len ) {  
                
                var kValue;  
                
                // a. Let Pk be ToString(k).  
                //   This is implicit for LHS operands of the in operator  
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.  
                //   This step can be combined with c  
                // c. If kPresent is true, then  
                if ( k in O ) {  
                    
                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.  
                    kValue = O[ k ];  
                    
                    // ii. Call the Call internal method of callback with T as the this value and  
                    // argument list containing kValue, k, and O.  
                    callback.call( T, kValue, k, O );  
                }  
                // d. Increase k by 1.  
                k++;  
            }  
            // 8. return undefined  
        }

        function reduce(accumulator){  
            if (this===null || this===undefined) throw new TypeError("Object is null or undefined");  
            var i = 0, l = this.length >> 0, curr;  
            
            if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."  
                throw new TypeError("First argument is not callable");  
            
            if(arguments.length < 2) {  
                if (l === 0) throw new TypeError("Array length is 0 and no second argument");  
                curr = this[0];  
                i = 1; // start accumulating at the second element  
            }  
            else  
                curr = arguments[1];  
            
            while (i < l) {  
                if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);  
                ++i;  
            }  
            
            return curr;  
        }

        function every(fun /*, thisp */)  
        {  
            "use strict";  
            
            if (this == null)  
                throw new TypeError();  
            
            var t = Object(this);  
            var len = t.length >>> 0;  
            if (typeof fun != "function")  
                throw new TypeError();  
            
            var thisp = arguments[1];  
            for (var i = 0; i < len; i++)  
            {  
                if (i in t && !fun.call(thisp, t[i], i, t))  
                    return false;  
            }  
            
            return true;  
        }

        function indexOf (searchElement /*, fromIndex */ ) {  
            "use strict";  
            if (this == null) {  
                throw new TypeError();  
            }  
            var t = Object(this);  
            var len = t.length >>> 0;  
            if (len === 0) {  
                return -1;  
            }  
            var n = 0;  
            if (arguments.length > 0) {  
                n = Number(arguments[1]);  
                if (n != n) { // shortcut for verifying if it's NaN  
                    n = 0;  
                } else if (n != 0 && n != Infinity && n != -Infinity) {  
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));  
                }  
            }  
            if (n >= len) {  
                return -1;  
            }  
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
            for (; k < len; k++) {  
                if (k in t && t[k] === searchElement) {  
                    return k;  
                }  
            }  
            return -1;  
        }  

        function arrays() {
            if (!Array.prototype.reduce)
                Array.prototype.reduce = reduce;
            
            if ( !Array.prototype.forEach )
                Array.prototype.forEach = forEach;

            if (!Array.prototype.every)  
                Array.prototype.every = every;  

            if (!Array.prototype.indexOf)  
                Array.prototype.indexOf = indexOf;  
        }
        
        function prependForEach(outerArr, innerForEach) {
            return function(fun) {
                outerArr.forEach(
                    function(inner){
                        inner[innerForEach](
                            function (/* arbitrary number of arguments */){
                                var args = Array.prototype.slice.call(arguments);
                                args.unshift(inner); 
                                fun.apply(this, args);
                            }
                        );
                    }
                );
            };

        }
        
        function bind(fun, thisp){
            return function() {
                return fun.apply(thisp, arguments);
            };
        }
        function assertType (typeName, obj) {
            var type = eval(typeName);
            if ( ! (obj instanceof type ) )
                throw(typeName+" expected");
            
        }
        function assertArrayOf(typeName, obj) {
            var type = eval(typeName);
            if ( ! (obj instanceof Array ) ||
                
                ! obj.every( function(elem, index) { return  (elem instanceof type); }))
                throw("Array of "+typeName+" expected");
        }
        // Returns an unique integer upon each call

        var uid =  (function(){ var counter = 0; return function(){ return counter++;};})();

        function log(str) {
//            console.log(str);
        }

        function mixin (src, tgt, propertyList) {
            forEach.call(propertyList, function (property) { if (property in src) tgt[property] = src[property];});
        }
        function optionHash(obj, defaults) {
            for ( var s in defaults )
                if (! (s in obj))
                    obj[s] = defaults[s];
            return obj;
        }
        function optionHashClone(obj, defaults) {
            var result = {};
            for ( var s in obj )
                result[s] = obj[s];
            for ( s in defaults )
                if (!(s in obj))
                    result[s] = defaults[s];
            
            return result;
        }
        function onLoad(images$, fun) {
            if (! images$.each(function(idx, elem) { return $(elem).outerWidth() > 0; } ))
                window.setTimeout(function() {onLoad(images$, fun);}, 100 );
            else
                fun.call();
        }
        return {
            spaceEvenly : spaceEvenly, $arr : $arr, jqToString : jqToString, arrays : arrays, prependForEach : prependForEach, 
            bind : bind, assertType : assertType, assertArrayOf : assertArrayOf, uid : uid, log : log, mixin : mixin,
            everyIn : everyIn, optionHash : optionHash, onLoad : onLoad,
            defaultEventSubscription : defaultEventSubscription, optionHashClone:optionHashClone, chainableFunction: chainableFunction
        };
    })();

Tools.arrays();




