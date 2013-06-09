/**
 * Notifications
 */
(function($){
    $.sdAjax.handleNotification = function(notification) {
        switch (notification.type) {
            case 'success' :
                notifications.addSuccess(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'info' :
                notifications.addInfo(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'error' :
                notifications.addError(notification.message, notification.title, notification.sticky, notification.icon);
                break;
            case 'warn' :
                notifications.addWarning(notification.message, notification.title, notification.sticky, notification.icon);
                break;
        }
    };

    $.sdAjax.afterHandle.notifications = function(data) {
        for(notification in data.notifications) {
            $.sdAjax.handleNotification(data.notifications[notification]);
        }
    }
})(jQuery);