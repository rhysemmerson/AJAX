
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
    
    $.sdAjax.beforeHandle = {};
    $.sdAjax.afterHandle = {};
    
    $.sdAjax.handleReturn = function(data, textStatus, jqXHR) {
        // Call before handle listeners
        for(fn in $.sdAjax.beforeHandle) {
            $.sdAjax.beforeHandle[fn].call(this,data);
        }
        
        // Update DOM
        for(update in data.updates) {
            $.sdAjax.handleHtml(data.updates[update].html, data.updates[update].action, data.updates[update].selector);
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
        if (selector == undefined) {
            selector = "";
        }
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
//    $.sdAjax.initAjaxLink('[data-role="ajax-link"]');
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
    $.fn.ajaxForm = function(options) {
        $.sdAjax.initAjaxForms(this, options);
    }
//    $('[data-role="ajax-form"]').ajaxForm();
})(jQuery);