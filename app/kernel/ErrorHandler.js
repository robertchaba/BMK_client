/**
 * A {@link BM.App} mixin that handles application errors.
 * 
 * This class catches errors trown with {@link Ext.Error.raise}
 * and shows a error message.  
 * By default the error message window will have 3 buttons:  
 * - `Report issue`         Open a report issue window.  
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

        Ext.Ajax.on('requestexception', me.onRequestexception, me);
        Ext.Ajax.on('requestcomplete', me.onRequestexception, me);

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
     * Raise an error if the response seccess property equals false and a 
     * message is defined.
     * 
     * Or call the {@link User.controller.Auth#onUnauthorized user controller} 
     * 
     * @private
     * @param {Ext.data.Connection} conn
     * @param {Object} response
     * @return {Boolean} True when an error is raised, false otherwise.s
     */
    onRequestexception : function (conn, response)
    {
        var me = this,
            app = me.getApplication(),
            responseText = response.responseText,
            responseObj = Ext.JSON.decode(responseText),
            errorMsg,
            exceptionMsg;

        /*
         * Call the {@link #unauthorizedControllerName}#{@link #unauthorizedMethodName}
         * action when a 401 header is found.
         */
        if (response && (response.status === 401)) {
            // End.
            return;
        }

        if (!responseObj) {
            // End. No response object found, this can be normal.
            return;
        }

        errorMsg = responseObj.message;
        exceptionMsg = responseObj.exception;

        if (!!responseObj.success || !responseObj.message) {
            if (errorMsg) {
                me.onErrorCatch({
                    isError : false,
                    title : 'Server message.',
                    msg : errorMsg,
                    addSuffix : false,
                    closable : true,
                    icon : Ext.Msg.INFO,
                    iconCls : 'icon-exclamation',
                    buttons : Ext.Msg.YESNO,
                    buttonText : {
                        yes : 'Report this message', // TEXT
                        no : 'Ok' // TEXT
                    }
                });
            }
            // End, No negative success or error message found.
            return;
        }

        Ext.Error.raise({
            title : 'Network or server error',
            msg : errorMsg,
            exception : exceptionMsg
        });

        // End.
        return true;
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
                isError : true,
                scope : me,
                addSuffix : true,
                closable : false,
                modal : true,
                icon : Ext.Msg.ERROR,
                iconCls : 'icon-bug',
                buttons : Ext.Msg.YESNOCANCEL,
                title : 'Application error', // TEXT
                msg : 'Undefined error message', // TEXT
                cls : 'x-fix-msg-msg',
                buttonText : {
                    yes : 'Report issue', // TEXT
                    no : 'Continue', // TEXT
                    cancel : 'Relaunch System' // TEXT
                },
                fn : me.handleMessageAction
            };

        Ext.apply(defaults, error);

        me.lastError = Ext.clone(defaults);

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
                me.onErrorContinue();
                break;
            case 'cancel':
                me.onErrorRelaunch();
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
        var me = this,
            reportController = me.getController('Application.controller.Report'),
            error = me.lastError,
            isError = error.isError,
            subject = error.title || null,
            descr = error.msg || null,
            exception = error.exception || null;

        BM.getApplication().logInfo('Report issue after application error.');

        reportController.report(isError
            ? 4
            : 3, subject, descr, exception);

        // End.
        return true;
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

        BM.getApplication()
            .logInfo('Continue using the application after error.');

        // End.
        return true;
    },
    /**
     * Get the caller method call tace.
     * 
     * @param {Boolean} withCallerFunc ...
     * @return {Array} Array with all caller names and optional the caller functions.
     */
    getCallTrace : function (withCallerFunc)
    {
        withCallerFunc = withCallerFunc || false;

        var me = this,
            callee = arguments.callee.caller,
            item,
            trace = [
            ];

        while (callee) {
            item = {
                name : callee.displayName || callee.name || callee.$name || null
            };

            if (withCallerFunc) {
                item.caller = callee;
            }

            trace.push(item);

            callee = callee.caller;
        }

        // End.
        return trace;
    }
});