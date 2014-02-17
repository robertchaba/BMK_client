Ext.define('BM.App', {
    namespaces : [
        'Application',
        'User',
        'Admin',
        'File'
    ],
    controllers : [
        'Application.controller.Index',
        'User.controller.Index',
        'User.controller.Auth',
        'Admin.controller.Index',
        'Admin.controller.Resources',
        'Admin.controller.Roles',
        'Admin.controller.Users',
        'Admin.controller.Permissions',
        'File.controller.Index',
        'File.controller.Manager'
    ],
    views : [
    ],
    models : [
    ],
    /* Do not edit below */
    extend : 'Ext.app.Application',
    name : 'BM',
    appFolder : 'app',
    autoCreateViewport : true,
    enableQuickTips : true,
    refs : [
        {
            ref : 'NorthRegion',
            selector : 'viewport [region=north]'
        },
        {
            ref : 'EastRegion',
            selector : 'viewport [region=east]'
        },
        {
            ref : 'SouthRegion',
            selector : 'viewport [region=south]'
        },
        {
            ref : 'WestRegion',
            selector : 'viewport [region=west]'
        },
        {
            ref : 'CenterRegion',
            selector : 'viewport [region=center]'
        }
    ],
    paths : {
        'Model' : 'app/model',
        'Application' : 'app/module/application',
        'User' : 'app/module/user',
        'Admin' : 'app/module/admin',
        'File' : 'app/module/file'
    },
    mixins : {
        acl : 'BM.kernel.Acl',
        contextmenu : 'BM.kernel.Contextmenu',
        errorHandler : 'BM.kernel.ErrorHandler',
        logger : 'BM.kernel.Logger',
        navigation : 'BM.kernel.Navigation',
//        notification : 'BM.kernel.Notification',
//        portal : 'BM.kernel.Portal',
        profile : 'BM.kernel.Profile',
//        sniffer : 'BM.kernel.Sniffer',
        workspace : 'BM.kernel.Workspace'
    },
    /**
     * Initialize the application classes who not depend on a loaded profile.
     *
     * @private
     * @return {Boolean} Void.
     */
    init : function ()
    {
        var me = this;

        me.initLogger();
        me.log('Initialize application.');

//        me.initSniffer();
        me.initErrorHandler();
        me.initStateHandler();
        me.initProfile();

        // End.
        return true;
    },
    /**
     * COMMENTME
     *
     * @private
     * @return {Boolean} Void.
     */
    launch : function ()
    {
        var me = this;
        me.loadProfile(me.logon, me);
        
        // End.
        return false;
    },
    /**
     * Initialize and configure the application. Based on the user settings and
     * ACL permissions the application is build up.
     *
     * @return {Boolean} Void.
     */
    logon : function ()
    {
        var me = this;

        if (!me.isAuthenticated()) {
            // End, User is not authenticated.
            return false;
        }

        me.initAcl();
        me.initWorkspace();
        me.initNavigation();

        me.getThrobber().hide();
        me.initContextmenu();

        // Hide the Powerd by element.
        Ext.fly('BM-PB').hide({
            delay : 5000,
            duration : 5000
        });

        // End.
        return true;
    },
    /**
     * 
     */
    logoff : function ()
    {
        var me = this;

        // Destroy open tabs

        me.destroyAcl();
        me.destroyNavigation();
        me.destroyWorkspace();

        me.loadProfile(me.logon, me);

        // End.
        return true;
    },
    /**
     * TMP
     */
    getApplicationLogo : function ()
    {
        // End.
        return {
            xtype : 'image',
            src : '/resources/images/application/app-logo.png',
            width : 92,
            height : 65
        };
    },
    /**
     * Define this method in portal class.
     * 
     * TMP
     */
    maximize : function (panel)
    {
        panel.closable = true;

        var me = this,
            center = me.getCenterRegion().child('tabpanel');

        center.add(panel);
        center.setActiveTab(panel);

        // End.
        return true;
    },
    /**
     * TMP
     */
    _createMaximizableWindow : function (item)
    {
        var me = this,
            center = me.getCenterRegion();

        // End.
        return Ext.create('Ext.window.Window', {
            renderTo : center.body,
            constrain : true,
            header : false,
            title : false,
            shadow : false,
            resizable : false,
            width : 50,
            height : 50,
            style : {
                border : 'none',
                'border-radius' : 0
            },
            items : [
                item
            ]
        });
    },
    /**
     * Initialize a state handle.
     * If the client support local storage, local staorage will be used,
     * cookie storage otherwise.
     *
     * @private
     * @return {Boolean} Void.
     */
    initStateHandler : function ()
    {
        // TEST
//        Ext.state.Manager.setProvider(Ext.supports.LocalStorage
//            ? new Ext.state.LocalStorageProvider()
//            : new Ext.state.CookieProvider());

        // End.
        return true;
    },
    /**
     * Capture and replace the configured callback and replace it with a MITM
     * callback.
     *
     * The original callback will be cancelled if the MITM callback returns false
     * and if the MITM callback returns a array this array will be used as arguments
     * for the original callback.
     *
     * @param {Object} config Object containing the callback.
     * @return {Object} Modified config object.
     */
    captureCallback : function (config)
    {
        config = config || {};

        var me = this,
            scope = config.scope || me,
            callback = config.callback,
            mitm = config.mitm,
            mitmScope = mitm.scope,
            mitmCallback = mitm.callback,
            mitmArguments = mitm.arguments;

        if (typeof mitmCallback !== 'function') {
            // End.
            me.logError('Man in the middle is not a function', {
                mitm : mitm
            });
            return config;
        }

        config.scope = me;
        config.callback = function ()
        {
            var mitmReturn,
                args = arguments;

            mitmReturn = Ext.callback(mitmCallback, mitmScope, args);

            if (mitmReturn === false) {
                // End, do not call the original callback.
                me.logNotice('Original callback cancelled by MITM.', {
                    callback : callback,
                    scope : scope,
                    mitm : mitm
                });
                return false;
            }

            Ext.callback(callback, scope, args);
            // End.
        };

        // End.
        return config;
    },
    /**
     * Returns true is the given module is loaded, modules need to be registered
     * in {@link Ext.app.Application#namespaces}
     * 
     * @param {String} module Module name
     * @return {Booleand} True is the module has at least loaded one allowed controller.
     */
    isModuleLoaded : function(module)
    {
        module = module.toLowerCase();
        
        var me = this,
            allowedController = me.getAllowedControllers(module);
        
        // End.
        return (allowedController.length > 0);
    }
});
