Ext.define('Application.controller.Index', {
    extend : 'BM.kernel.ns.Controller',
    /**
     * @inheritdoc
     */
    id : 'applicationIndexController',
    /**
     * @inheritdoc
     */
    refs : [
    ],
    /**
     * @inheritdoc
     */
    stores : [
    ],
    /**
     * @inheritdoc
     */
    models : [
    ],
    /**
     * @inheritdoc
     */
    views : [
    ],
    /**
     * @inheritdoc
     */
    contextmenus : {
        'combobox' : [
            {
                text : 'Reload list', // Text
                handler : function (menuItem)
                {
                    var comboId = menuItem.parentMenu.contextmenuTarget.id.slice(0, -8),
                        combobox = Ext.getCmp(comboId);
                    combobox.getStore().reload();
                }
            }
        ]
    },
    /**
     * @inheritdoc
     */
    listeners : {
    },
    /**
     * @inheritdoc
     */
    init : function (application)
    {
        var me = this;

        // Add listeners to components.
        this.control({});
    },
    /**
     * @inheritdoc
     */
    onLaunch : function (application)
    {
    },
    /**
     * @inheritdoc
     */
    onPortal : function (portal)
    {
    },
    /**
     * @inheritdoc
     */
    onDispatch : function ()
    {
    },
    /**
     * @private
     */
    getAppContextmenus : function ()
    {
        var me = this,
            contextmenuConfig = {
                'BM-navigation' : [
                    {
                        text : 'Header contextmenu item',
                        handler : function (item, e)
                        {
                            // Action code
                        }
                    },
                    {
                        text : 'Bla',
                        handler : function ()
                        {
                        }
                    }
                ]
            };

        // End.
        return contextmenuConfig;
    }
});
