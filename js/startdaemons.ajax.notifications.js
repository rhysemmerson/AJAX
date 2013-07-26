/**
 * Notifications
 * requires jquery gritter
 * 
 * May need refactoring.
 */
(function($){
    $.sdAjax.notifications = {
        init : function() {
            $.extend($.gritter.options, { 
                position: 'bottom-left', // defaults to 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right' (added in 1.7.1)
                fade_in_speed: 1000,
                fade_out_speed: 4000,
                time: 5000 
            });
        },
        addSuccess : function(text, title, sticky, icon) {
            $.sdAjax.notifications.add(text,title,sticky, "alert-success", icon);
        },
        addError : function(text, title, sticky, icon) {
            $.sdAjax.notifications.add(text,title,sticky, "alert-error", icon);
        },
        addWarning : function(text, title, sticky, icon) {
            $.sdAjax.notifications.add(text,title,sticky, null, icon);
        },
        addInfo : function(text, title, sticky, icon) {
            $.sdAjax.notifications.add(text,title,sticky, "alert-info", icon);
        },
        add : function(text, title, sticky, class_name, icon) {
            if (sticky == undefined)
                sticky = false;
            if (icon != undefined && icon != false) {
                text = "<i class=\"icon-" + icon + " icon-4x pull-left\"> </i>" + text;
            }
            $.gritter.add({
                title : title,
                text : text,
                sticky : sticky,
                class_name : 'alert ' + class_name
            });
        }
    }

    $.sdAjax.notifications.init();

    $.sdAjax.handleNotification = function(notification) {
        switch (notification.type) {
            case 'success' :
                $.sdAjax.notifications.addSuccess(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'info' :
                $.sdAjax.notifications.addInfo(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'error' :
                $.sdAjax.notifications.addError(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'warn' :
                $.sdAjax.notifications.addWarning(notification.message, notification.title, notification.sticky, notification.icon);
                break;
        }
    };

    /* register handler to run after server response */
    $.sdAjax.afterHandle.notifications = function(data) {
        for(notification in data.notifications) {
            $.sdAjax.handleNotification(data.notifications[notification]);
        }
    }
})(jQuery);