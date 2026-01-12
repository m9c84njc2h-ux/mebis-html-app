function Subtitle(options) {
    
    var thisp = this;

    this.update = function() { thisp.updateSubs(); };
    this.subs = [];
    var subs = options.subtitles;
    if (subs instanceof Array)
        this.subs = subs;
    else
        for (t in subs)
            this.subs.push(new Subtitle.line(Number(t), subs[t]));

    this.subs.sort(function(a,b){ return a.compare(b);});

    if ('element' in options)
        this.elem$ = options.element;

    var callback = 'callback' in options ? options.callback: this.showSub;
    
    this.currentSub = function(i) {
        callback.call(thisp, i);
    };
    this.video = null;
    this.activeIndex = null;
    
}
Subtitle.line = function(timeIndex, content) {
    this.t = timeIndex;
    this.content = content;
};
Subtitle.line.prototype = {
    laterThan: function(t) {
        return this.t > t;
    },
    compare: function(b) {
        return this.t - b.t;
    }
};
Subtitle.prototype = {
    updateSubs: function() {
        var t = this.video.prop('currentTime');
        var subt,sub = this.getActiveSub(t);

        // If there are more than one subs at the same time index,
        // always return the sub with the highest array index
        if (sub >= 0) {
            subt = this.subs[sub].t;
            while (sub + 1 < this.subs.length && this.subs[sub + 1].t == subt)
                sub++;
        }
        if (this.activeIndex != sub) {
            this.activeIndex = sub;
            this.currentSub(sub);
        }
    },
    showSub: function(i) {
        
        this.elem$.html(i >= 0 ? this.subs[i].content : "");
    },
    getActiveSub: function(t) {
        var found = -1;
        for (var i = 0; i < this.subs.length; i++)
            if (this.subs[i].laterThan(t))
                break;
        else
            found = i;
        return found;
    },
    
    attach: function(video){
        this.detach();
        this.video = $(video);
        if (this.elem$)
            this.elem$.show();
        this.video.bind('timeupdate.subtitles',this.update);
    },
    detach: function(){
        if (this.video) {
            if (this.elem$)
                this.elem$.hide();
            this.video.unbind('timeupdate.subtitles');
            this.video = null;
            this.activeIndex = null;
        }
    }
};
