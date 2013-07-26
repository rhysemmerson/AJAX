
(function($){
    /*
     * TODO: refactor this, it's only a temp solution
     */
    $.union = function(array1, array2) {
        var hash = {}, union = [];
        $.each($.merge($.merge([], array1), array2), function (index, value) {
            hash[value] = value;
        });
        $.each(hash, function (key, value) {
            union.push(key);
        } );
        return union;
    };
})(jQuery);

/**
 * Ajax core :
 *  DOM updating
 *  Ajax Link
 *  Ajax Load
 *  Ajax Form
 */
(function($){

    $.sdAjax = function(action, options) {
        
    }
    
    /*
     * Global callbacks, should use events instead.
     */
    $.sdAjax.beforeHandle = {};
    $.sdAjax.afterHandle = {};
    $.sdAjax.beforeUpdateDOM = {};
    
    /**
     * Handle respone from server
     */
    $.sdAjax.handleReturn = function(data, textStatus, jqXHR) {
        // Call before handle listeners
        for(fn in $.sdAjax.beforeHandle) {
            $.sdAjax.beforeHandle[fn].call(this,data);
        }
        
        // Update DOM
        for(update in data.updates) {
            var html = $.parseHTML(data.updates[update].html);
            var selector = data.updates[update].selector;
            // call DOM update callbacks, use parsed elements so they
            // can initialized by plugins
            for(fn in $.sdAjax.beforeUpdateDOM) {
                $.sdAjax.beforeUpdateDOM[fn].call(this, html, selector);
            }
            $.sdAjax.handleHtml(html, data.updates[update].action, data.updates[update].selector);
        }
        
        // Load referred requests
        if (data.refer != undefined) {
            for(refer in data.refer) {
                $.get(data.refer[refer].url, {}, $.sdAjax.handleReturn);
            }
        }
        
        // Deprecated, create plugins instead
        if (data.script != undefined) {
            var text = $(data.script).text();
            eval(text);
        }
        
        if (data.call != undefined) {
            for (call in data.call) {
                var string = data.call[call].name;
                
                var scope = window;
                var scopeSplit = string.split('.');
                for (i = 0; i < scopeSplit.length - 1; i++)
                {
                    scope = scope[scopeSplit[i]];

                    if (scope == undefined) break;
                }
                fn = scope[scopeSplit[scopeSplit.length - 1]];
                fn();
            }
        }
        
        // Call after handle listeners
        for(fn in $.sdAjax.afterHandle) {
            $.sdAjax.afterHandle[fn].call(this,data);
        }
    }
    
    // Update DOM
    $.sdAjax.handleHtml = function(html, action, selector) {
        switch (action) {
            case 'replace' :
                $(selector).replaceWith(html);
                break;
            case 'replaceInner' :
                $(selector).html(html);
                break;
            case 'append' :
                $(selector).append(html);
                break;
            case 'prepend' :
                $(selector).prepend(html);
                break;
            case 'remove' :
                $(selector).remove();
                break;
        }
    }
})(jQuery);

/**
 * Ajax Link
 */
(function($){
    $.sdAjax.initAjaxLink = function(selector) {
        $(selector).on('click',function(event){
            event.preventDefault();
            var data = {};
            
            data.selector = $(this).data('selector');
            data.action = $(this).data('action');
            
            var extra = $(this).data('extra');
            if (extra != undefined && extra != '') {
                $.extend(data, extra);
            }
            $.post($(this).attr('href'), data, function(data, textStatus, jqXHR){
                $.sdAjax.handleReturn(data, textStatus, jqXHR);
            });
        });
    }
    /* initialize after ajax update using selectors previously used */
    $.sdAjax.initAjaxLink.selectors = [];
    $.sdAjax.beforeUpdateDOM.initAjaxLink = function(html, selector) {
        for(selector in $.sdAjax.initAjaxLink.selectors) {
            if (selector == 'length')
                continue;
            $(html).find($.sdAjax.initAjaxLink.selectors[selector]).ajaxLink();
        }
    }
    /* add a jQuery function */
    $.fn.ajaxLink = function() {
        $.sdAjax.initAjaxLink.selectors = $.union($.sdAjax.initAjaxLink.selectors, [this.selector]);
        $.sdAjax.initAjaxLink(this);
    }
})(jQuery);

/**
 * Ajax Forms
 */
(function($){    
    $.sdAjax.initAjaxForms = function(selector, options) {
        var opts = $.extend( {}, $.sdAjax.initAjaxForms.defaults, options );
        
        $(selector).on('submit', function(event) {
            event.preventDefault();
            var data = $(this).serializeArray();
            $.post($(this).attr('action'),data, $.sdAjax.handleReturn);
            if (opts.afterSubmit != undefined) {
                opts.afterSubmit();
            }
        });
    }
    $.sdAjax.initAjaxForms.defaults = {};
    $.sdAjax.initAjaxForms.selectors = [];
    /* initialize after ajax update */
    $.sdAjax.beforeUpdateDOM.initAjaxForms = function(html, selector) {
        for(selector in $.sdAjax.initAjaxForms.selectors) {
            if (selector == 'length')
                continue;
            var sel = $.sdAjax.initAjaxForms.selectors[selector];
            var forms = $(html).filter(sel);
            forms.ajaxForm();
        }
    }
    /* add a jQuery function */
    $.fn.ajaxForm = function(options) {
        $.sdAjax.initAjaxForms.selectors = $.union($.sdAjax.initAjaxForms.selectors, [this.selector]);
        $.sdAjax.initAjaxForms(this, options);
    }
})(jQuery);

/**
 * Ajax Load
 */
(function($){
    $.sdAjax.initAjaxLoad = function(selector) {
        $(selector).each(function(){
            url = $(this).data('url');
            $.get(url, {}, $.sdAjax.handleReturn);
        });
    };
    /* initialize loaded DOM elements */
    $.sdAjax.initAjaxLoad.selectors = [];
    $.sdAjax.beforeUpdateDOM.initAjaxLoad = function(html, selector) {
        for(selector in $.sdAjax.initAjaxLoad.selectors) {
            if (selector == 'length')
                continue;
            $(html).find($.sdAjax.initAjaxLoad.selectors[selector]).ajaxLoad();
        }
    }
    /* add a jQuery function */
    $.fn.ajaxLoad = function() {
        $.sdAjax.initAjaxLoad.selectors = $.union($.sdAjax.initAjaxLoad.selectors, [this.selector]);
        $.sdAjax.initAjaxLoad(this);
    };
})(jQuery);