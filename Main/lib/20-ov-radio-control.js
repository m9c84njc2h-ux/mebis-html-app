// see ov-radio-control.inc.tpl for more info

function OvRadioControl(selector) {
    if (selector[0] != '#' && selector[0] != '.')
        selector = '#' + selector;
    this.element = $(selector);
    this.options = this.element.find('input');
    
}
OvRadioControl.prototype = {
    disable: function() {
        this.options.unbind('click').bind('click.OvRadioControl', function() {return false});
        this.element.addClass('radio-control-disabled');
    },
    enable: function() {
        this.options.unbind('click.OvRadioControl').click(this.clickHandler);
        this.element.removeClass('radio-control-disabled');
    },
    onClick: function(f) {
        var thisp = this;
        this.clickHandler = function() {
            f(thisp.options.filter(':checked').val());
        };
        this.options.first().prop('checked', true);
        this.enable();
    }
}

OvRadioControl.onClick = function(selector, f) {
    var control = new OvRadioControl(selector);
    control.onClick(f);
}
OvRadioControl.register = function(selector, ov) {
    this.onClick(selector, function(n){ov.goToSlide(n);});
}
