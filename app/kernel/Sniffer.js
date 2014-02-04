/**
 * A {@link BM.App} mixin that can detect some the clients information like
 * browser or operating system info.
 *
 * http://www.quirksmode.org/js/detect.html
 */
Ext.define('BM.kernel.Sniffer', {
    /**
     * @private
     * @property {Array} operatingSystems List of operating systems.
     */

    /**
     * @private
     * @property {Array} browsers List of browsers.
     */

    /**
     * @private
     * @property {String} OSName The operating system name.
     */

    /**
     * @private
     * @property {String} browserName The browser name.
     */

    /**
     * @private
     * @property {String} browserVersion The browser version.
     */

    /**
     * @private
     * @property {String} versionKey Name that identify the browser version.
     */

    /**
     * @param {BM.App} app
     * @chainable
     */
    initSniffer : function ()
    {
        var me = this;

        me.initOperatingSystems();
        me.initBrowsers();

        me.OSName = me.findString(me.operatingSystems);

        me.browserName = me.findString(me.browsers);
        me.browserVersion = me.findVersion(navigator.userAgent) || me.findVersion(navigator.appVersion);

        // End.
        return me;
    },
    /**x
     * Return the operating system name.
     *
     * @return {String} operating system name.
     */
    getOSName : function ()
    {
        var me = this;
        // End.
        return me.OSName || 'Unknown operating system.'; // TEXT
    },
    /**
     * Return the browser name.
     *
     * @return {String} Browser name.
     */
    getBrowserName : function ()
    {
        var me = this;
        // End.
        return me.browserName || 'Unknown browser.'; // TEXT
    },
    /**
     * Return the browser version number.
     *
     * @return {Number|Null} Browser version number or Null if no version can be found.
     */
    getBrowserVersion : function ()
    {
        var me = this;
        // End.
        return me.browserVersion || null;
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
            callee = arguments.callee,
            item,
            trace = [];
        
        while(callee = callee.caller) {
            item = {
                name : callee.displayName || callee.name || callee.$name || null
            };
            
            if (withCallerFunc) {
                item.caller = callee;
            }
            
            trace.push(item);
        }

        // End.
        return trace;
    },
    /**
     * Search for the browser or operating system name.
     *
     * @private
     * @param {Array} data
     * @return {String} browser or operating system name
     */
    findString : function (data)
    {
        var me = this,
            dataString,
            dataProp;

        Ext.Array.each(data, function (item)
        {
            dataString = item.string;
            dataProp = item.prop;
            me.versionKey = item.versionSearch || item.identity;
            if (dataString && dataString.indexOf(item.subString) !== -1) {
                // End, Return identity.
                return item.identity;
            }

            if (dataProp) {
                // End, Return identity.
                return item.identity;
            }

            // End.
        });

        // End, No matching string found.
        BM.getApplication().logNotice('Browser or OS not indentified.');
        return '';
    },
    /**
     * Search for the browser version number, if available.
     *
     * @private
     * @param {String} data Client UserAgent string.
     * @return {Number} browser version number.
     */
    findVersion : function (data)
    {
        var me = this,
            index = data.indexOf(me.versionKey);

        if (index === -1) {
            // End.
            BM.getApplication().logNotice('Browser version not indentified.');
            return null;
        }

        // End.
        return parseFloat(data.substring(index + me.versionKey.length + 1));
    },
    /**
     * Set all detectable operation systems.
     *
     * @private
     * @return {Boolean} Void.
     */
    initOperatingSystems : function ()
    {
        var me = this;
        me.operatingSystems = [
            {
                string : navigator.platform,
                subString : 'Win',
                identity : 'Windows'
            },
            {
                string : navigator.platform,
                subString : 'Mac',
                identity : 'OSX'
            },
            {
                string : navigator.userAgent,
                subString : 'iPhone',
                identity : 'iPhone/iPod'
            },
            {
                string : navigator.platform,
                subString : 'Linux',
                identity : 'Linux'
            }
        ];

        // End.
        return true;
    },
    /**
     * Set all detectable browser.
     *
     * @private
     * @return {Boolean} Void.
     */
    initBrowsers : function ()
    {
        var me = this;
        me.browsers = [
            {
                string : navigator.userAgent,
                subString : 'Chrome',
                identity : 'Chrome'
            },
            {
                string : navigator.userAgent,
                subString : 'OmniWeb',
                versionSearch : 'OmniWeb/',
                identity : 'OmniWeb'
            },
            {
                string : navigator.vendor,
                subString : 'Apple',
                identity : 'Safari',
                versionSearch : 'Version'
            },
            {
                prop : window.opera,
                identity : 'Opera',
                versionSearch : 'Version'
            },
            {
                string : navigator.vendor,
                subString : 'iCab',
                identity : 'iCab'
            },
            {
                string : navigator.vendor,
                subString : 'KDE',
                identity : 'Konqueror'
            },
            {
                string : navigator.userAgent,
                subString : 'Firefox',
                identity : 'Firefox'
            },
            {
                string : navigator.vendor,
                subString : 'Camino',
                identity : 'Camino'
            },
            {// for newer Netscapes (6+)
                string : navigator.userAgent,
                subString : 'Netscape',
                identity : 'Netscape'
            },
            {
                string : navigator.userAgent,
                subString : 'MSIE',
                identity : 'Explorer',
                versionSearch : 'MSIE'
            },
            {
                string : navigator.userAgent,
                subString : 'Gecko',
                identity : 'Mozilla',
                versionSearch : 'rv'
            },
            {// for older Netscapes (4-)
                string : navigator.userAgent,
                subString : 'Mozilla',
                identity : 'Netscape',
                versionSearch : 'Mozilla'
            }
        ];

        // End.
        return true;
    }
});