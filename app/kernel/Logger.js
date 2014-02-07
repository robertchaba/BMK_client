/**
 * A {@link BM.App} mixin that can log messages. These messgaes are used for 
 * debugging and analysing the application uses.
 * 
 * Messages will be logged in a certain level.
 * By default the level `log` is used. Other levels are:  
 * `info` ...  
 * `notice` ...  
 * `warning` ...  
 * `error` ...
 *  
 * If a console is present the message will be logged to the console.
 * 
 * Example:
 * 
 *     this.getApplication().log('simple log message');
 *     
 * Is the same as
 * 
 *     this.getApplication().log('another log message', 'log');
 *     
 * Each log level also have a shortcut method like
 * 
 *     this.getApplication().logInfo('shortcut info log');
 *     
 * It is also possible to add additional data to the logs.
 * 
 *     this.getApplication().logWarning('some warning message with analyse data', ['data', 'array']);
 */
Ext.define('BM.kernel.Logger', {
    /**
     * @private
     * @property {Array} logs
     */

    /**
     * @cfg {Number} maxLogs Maximum number of stored logs.
     */

    /**
     * Initialize.
     * 
     * @chainable
     */
    initLogger : function (cfg)
    {
        cfg = cfg || {};

        var me = this;

        me.maxLogs = cfg.maxLogs || 50;
        me.logs = [];

        // End.
        return me;
    },
    /**
     * Return all logged logs.
     * 
     * @return {Array} logs.
     */
    getLogs : function ()
    {
        var me = this;
        // End.
        return me.logs;
    },
    /**
     * Set the maximum number of stored logs
     * 
     * @param {Number} max
     * @chainable
     */
    setMaxLogs : function (max)
    {
        var me = this;
        me.maxLogs = max;
        // End.
        return me;
    },
    /**
     * return the maximum number of stored logs
     * 
     * @return {Number}
     */
    getMaxLogs : function ()
    {
        var me = this;
        // End.
        return me.maxLogs;
    },
    /**
     * Log a message.
     * 
     * @param {String} msg Log message
     * @param {String} [level=log] Log level
     * @param {Mixed} [dump] Log dump
     * @return {Boolean} True is message is logged, false otherwise.
     */
    log : function (msg, level, dump)
    {
        level = level || 'log';
        dump = dump || {};

        var me = this,
            date = new Date(),
            logObject;

        if (typeof msg !== 'string') {
            // End, msg need to be an string.
            return false;
        }

        logObject = {
            msg : msg,
            level : level,
            dump : dump,
            date : date
        };
        me.logConsole(logObject);

        if (me.logs.length >= me.maxLogs) {
            me.logs.shift();
        }

        me.logs.push(logObject);

        // End.
        return true;
    },
    /**
     * Log an informative message.  
     * Use this method to log user actions.
     * 
     * @param {String} msg Log message
     * @param {Mixed} [dump] Log dump
     * @return {Boolean} True is message is logged, false otherwise.
     */
    logInfo : function (msg, dump)
    {
        var me = this;
        // End.
        return me.log(msg, 'info', dump);
    },
    /**
     * Log a notification message.  
     * Use this method to log notifiable behaviors like early returns because
     * given parameters are invalid but probably there is no risk on an error.
     * 
     * @param {String} msg Log message
     * @param {Mixed} [dump] Log dump
     * @return {Boolean} True is message is logged, false otherwise.
     */
    logNotice : function (msg, dump)
    {
        var me = this;
        // End.
        return me.log(msg, 'notice', dump);
    },
    /**
     * Log a warning.  
     * Use this method to log notifiable behaviors like early returns because
     * given parameters are invalid and there is an risk the application run 
     * into errors.
     * 
     * @param {String} msg Log message
     * @param {Mixed} [dump] Log dump
     * @return {Boolean} True is message is logged, false otherwise.
     */
    logWarning : function (msg, dump)
    {
        var me = this;
        // End.
        return me.log(msg, 'warning', dump);
    },
    /**
     * Log an error message.  
     * Do not use this method, if an error is expected, use 
     * {@link Ext.Error.raise} to throw errors. Thrown error will be catched and
     * the error message will be logged using this method.
     * 
     * @param {String} msg Log message
     * @param {Object} [dump] Log dump
     * @return {Boolean} True is message is logged, false otherwise.
     */
    logError : function (msg, dump)
    {
        dump = dump || {};
        dump.callHistory = 'Disabled';//BM.getApplication().getCallTrace(true);

        var me = this;
        // End.
        return me.log(msg, 'error', dump);
    },
    /**
     * Log messages to the console if a console is present.
     * 
     * @private
     * @param {Object} log
     * @return {Boolean} Void.
     */
    logConsole : function (log)
    {
        log = log || {};

        var con = Ext.global.console,
            msg = log.msg,
            level = log.level,
            dump = log.dump;

        msg = level.toUpperCase() + ': ' + msg + ' =>';
        con.log(msg, dump);

        // End.
        return true;
    }
});