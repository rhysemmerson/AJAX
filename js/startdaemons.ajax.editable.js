/**
 * Editable:
 *  Editable fields: Show a form when an editable field is clicked on.
 *  Edit link: Edit a field by clicking on a link.
 *  
 * Needs refactoring.
 */
(function($){
    $.sdAjax.editable = {
        editableFieldsInit : function(selectorPrefix) {
            if (selectorPrefix == undefined) {
                selectorPrefix = "";
            } else {
                selectorPrefix += " ";
            }
            $.sdAjax.editable.initEditableFields(selectorPrefix);
            $.sdAjax.editable.initEditLink(selectorPrefix);
            $.sdAjax.editable.initAjaxForms(selectorPrefix);
        },
        initEditableFields : function(selectorPrefix) {
            // hide editable forms
            $(selectorPrefix + '.edit-input').hide();
            // show forms and hide display elements when the user clicks one
            $(selectorPrefix + '.editable').on('click',function(event){
                $(this).siblings('.edit-input').show();
                $(this).hide();
            });
            // hide edit icons
            $(selectorPrefix + '.editable').siblings('.icon-edit').hide();
            // show edit icons on hover
            $(selectorPrefix + '.editable').hover(function(){
                $(this).siblings('.icon-edit').show();
            }, function(){
                $(this).siblings('.icon-edit').hide();
            });
            // hide form, show display on cancel
            $('.editable-cancel').on('click', function(event){
                event.preventDefault();
                $(this).closest('.edit-input').hide();
                $(this).closest('.edit-input').siblings('.editable').show();
            });
        },
        initAjaxForms : function(selectorPrefix) {
            $(selectorPrefix + 'form.ajax').on('submit',function(){
                $(this).closest('.edit-input').siblings('.editable').show();
                $(this).closest('.edit-input').hide();
            });
        },
        initEditLink : function(selectorPrefix) {
            $(selectorPrefix + '.edit-link').on('click',function(event){
                event.preventDefault();
                var data = {};
            
                var name = $(this).data('name');
                var value = $(this).data('value');
                data[name] = value;
            
                data.selector = $(this).data('selector');
                data.action = $(this).data('action');
            
                var extra = $(this).data('extra');
                if (extra != undefined && extra != '') {
                    exArr = $.parseJSON(extra);
                    $.extend(data, exArr);
                }
                $.post($(this).attr('href'), data, function(data, textStatus, jqXHR){
                    $.sdAjax.handleReturn(data, textStatus, jqXHR);
                });
            });
        }
    }
    
    /* initialize after ajax update */
    $.sdAjax.afterHandle.editable = function(data) {
        for(update in data.updates) {
            $.sdAjax.editable.editableFieldsInit(data.updates[update].selector);
        }
    }
})(jQuery);