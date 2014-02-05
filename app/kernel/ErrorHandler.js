/**
 * A {@link BM.App} mixin that handles application errors.
 * 
 * This class catches errors trown with {@link Ext.Error.raise}
 * and shows a error message.  
 * By default the error message window will have 3 buttons:  
 * - `Report issue`         Open a report issue window, handled by the {@link BM.controller.application.Error}.  
 * - `Relaunch application` Simple reload the page.  
 * - `Continue`             Close the window and let the user continue.
 */
Ext.define('BM.kernel.ErrorHandler', {
    uses : [
        'Ext.Error',
        'Ext.window.MessageBox',
        'BM.kernel.Logger'
    ],
    /**
     * @private
     * @property {Object} lastError
     */

    /**
     * @param {BM.App} app
     * @chainable
     */
    initErrorHandler : function ()
    {
        var me = this;

        // Dont lose the scope.
        Ext.Error.handle = function (error)
        {
            me.onErrorCatch(error);
            // End.
        };

        // End.
        return me;
    },
    /**
     * Catch a raised error and show a error message.
     * 
     * @private
     * @param {Object} error
     * @return {Boolean} Void. 
     */
    onErrorCatch : function (error)
    {
        var me = this;

        me.lastError = error;
        me.showErrorMessage(error);

        // End.
        return true;
    },
    /**
     * Show a error message.
     * 
     * @private
     * @param {Object} error
     * @return Boolean Void.
     */
    showErrorMessage : function (error)
    {
        if (error.showError && error.showError !== true) {
            // End, Configured to not show a message.
            return false;
        }

        var me = this,
            msgSuffix = '<br>\'Report issue\' to help debugging this system. \'Continue\' otherwise.',  // TEXT
            defaults = {
                scope : me,
                addSuffix : true,
                closable : false,
                modal : true,
                icon : Ext.Msg.ERROR,
                buttons : Ext.Msg.YESNOCANCEL,
                title : 'Application error', // TEXT
                msg : 'Undefined error message', // TEXT
                cls : 'x-fix-msg-msg',
                buttonText : {
                    yes : 'Report issue', // TEXT
                    no : 'Relaunch System', // TEXT
                    cancel : 'Continue' // TEXT
                },
                fn : me.handleMessageAction
            };

        Ext.apply(defaults, error);

        if (defaults.addSuffix && (defaults.msg.indexOf(msgSuffix) === -1)) {
            defaults.msg += msgSuffix;
        }

        Ext.Msg.show(defaults);

        // End.
        return true;
    },
    /**
     * Handle the error message action.
     * Map the message buttons to there corresponding action methods.
     * 
     * @private
     * @param {String} buttonId Possible values are `yes`, `no` and `cancel`.
     * @return {Boolean} Void.
     */
    handleMessageAction : function (buttonId)
    {
        var me = this;

        switch (buttonId) {
            case 'yes':
                me.onErrorReport();
                break;
            case 'no':
                me.onErrorRelaunch();
                break;
            case 'cancel':
                me.onErrorContinue();
                break;
        }

        // End.
        return true;
    },
    /**
     * Show the error reporting window and let the errorController handle it
     * from here on.
     * 
     * @private
     * @return {Boolean} Void.
     */
    onErrorReport : function ()
    {
        var me = this;

        BM.getApplication().logInfo('Report issue after application error.');

        Ext.Msg.show({
            msg : 'Please report errors on https://github.com/WitteStier/BMKernel_client/issues.'
        });
        // TODO Open the error report window.
        // TODO Implement a error report controller and views.
        // End.
    },
    /**
     * Save the catched error report and re-launch the application.
     * 
     * @private
     * @return {Boolean} Void.
     */
    onErrorRelaunch : function ()
    {
        var me = this;

        BM.getApplication().logInfo('Re-launch application after error.');

        // TODO Call the error report controller
        // and collect and save a error report

        window.location.href = '/';

        // End.
        return true;
    },
    /**
     * Save the catched error report and continue with the application.
     * 
     * @private
     * @return {Boolean} Void.
     */
    onErrorContinue : function ()
    {
        var me = this;

        BM.getApplication().logInfo('Continue using the application after error.');

        // TODO Call the error report controller
        // and collect and save a error report.

        // End.
        return true;
    }
});