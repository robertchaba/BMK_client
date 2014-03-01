/**
 * A {@link BM.App} mixin for setting up and handling common workspace
 * functionalities.
 * 
 * The workspace is is basically a {@link Ext.tab.Panel} with a
 * {@link Ext.toolbar.Toolbar} added to the right of the default {@link Ext.tab.Bar}.
 * 
 * The added toolbar contains a load indicator, avatar and a quick menu.
 */
Ext.define('BM.kernel.Workspace', {
    uses : [
        'Ext.tab.Panel',
        'Ext.toolbar.Toolbar'
    ],
    /**
     * Initialize the application workspace.
     * This workspace lives in the {@link BM.view.Viewport} center region.
     * 
     * @chainable
     */
    initWorkspace : function ()
    {
        var me = this;

        me.workspace = me.createWorkspace();
        me.setWorkspace(me.workspace);
        me.initRequestListeners();
        // End.
        return me;
    },
    /**
     * Set the workspace and add it to the {@link BM.view.Viewport} center.
     * 
     * @param {Ext.tab.Panel} workspace
     * @chainable
     */
    setWorkspace : function (workspace)
    {
        var me = this,
            center = BM.getApplication().getCenterRegion(),
            toolbar;
        me.workspace = workspace;

        center.removeAll();
        center.add(workspace);

        toolbar = me.createWorkspaceToolbar();

        workspace.insertDocked(0, toolbar);
        toolbar.getEl().slideIn('t', {
            delay : 50,
            duration : 100
        });

        // End.
        return me;
    },
    /**
     * Return the to the viewport center added workspace.
     * 
     * @return {Ext.tab.Panel}
     */
    getWorkspace : function ()
    {
        // End.
        return BM.getApplication().getCenterRegion().child('#BM-workspace-tab');
    },
    /**
     * Return {@link Ext.Img} image component.
     * Use {@link #getThrobber}.{@link Ext.Img#show show()} or
     * {@link #getThrobber}.{@link Ext.Img#hide hide()} to show or hide the
     * throbber.
     *
     * @return {Ext.Img}
     */
    getThrobber : function ()
    {
        // End.
        return Ext.ComponentQuery.query('#BM-workspace-toolbar-throbber')[0];
    },
    /**
     * Return {@link Ext.button.Button} component.
     * Use {@link #getAvatar}.{@link Ext.button.Button#setIcon setIcon()}
     * to set the avatar image.
     * And {@link #getAvatar}.{@link Ext.button.Button#setText setText()}
     * to set the username.
     *
     * @return {Ext.button.Button}
     */
    getAvatar : function ()
    {
        // End.
        return Ext.ComponentQuery.query('#BM-workspace-toolbar-avatar')[0];
    },
    /**
     * Return {@link Ext.menu.Menu} component.
     * Use {@link #getQuickMenu}.{@link Ext.menu.Menu#add add()} to add
     * actions to the quick menu.
     *
     * @return {Ext.menu.Menu}
     */
    getQuickMenu : function ()
    {
        // End.
        return Ext.ComponentQuery.query('#BM-workspace-toolbar-avatar menu')[0];
    },
    /**
     * Initialize ajax request listeners and show or hide the throbber.
     * 
     * @private
     * @chainable
     */
    initRequestListeners : function ()
    {
        var me = this,
            throbber = me.getThrobber();

        Ext.Ajax.on('beforerequest', throbber.show, throbber);
        Ext.Ajax.on('requestcomplete', throbber.hide, throbber);

        // End.
        return me;
    },
    /**
     * Destroy the workspace and all added tabs.
     * 
     * @private
     * @chainable
     */
    destroyWorkspace : function ()
    {
        var me = this,
            workspace = me.getWorkspace(),
            tabBar = workspace.dockedItems.first(),
            throbber = me.getThrobber();

        Ext.Ajax.un('beforerequest', throbber.show, throbber);
        Ext.Ajax.un('requestcomplete', throbber.hide, throbber);

        tabBar.getEl().slideOut('t', {
            duration : 100,
            callback : function ()
            {
                workspace.destroy();
            }
        });

        // End.
        return me;
    },
    /**
     * Return a new created {@link Ext.tab.Panel workspace} instance.
     * 
     * @private
     * @return {Ext.tab.Panel} Workspace instance.
     */
    createWorkspace : function ()
    {
        var me = this;

        // End.
        return new Ext.tab.Panel({
            id : 'BM-workspace-tab',
            tabPosition : 'top',
            tabBar : {
                flex : 1
            }
        });
    },
    /**
     * Return a new created {@link Ext.toolbar.Toolbar} instance.
     * 
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar instance.
     */
    createWorkspaceToolbar : function ()
    {
        var me = this,
            workspace = me.getWorkspace(),
            tabBar = workspace.getTabBar(),
            app = BM.getApplication(),
            avatar = app.getPersonModel().getAvatar(),
            userName = app.getPersonModel().getFullname(),
            quickmenu = app.getAllowedQuickmenu(),
            items = [
                {
                    xtype : 'image',
                    id : 'BM-workspace-toolbar-throbber',
                    src : '/resources/images/application/loader.gif',
                    width : 32,
                    height : 32
                },
                {
                    id : 'BM-workspace-toolbar-avatar',
                    icon : avatar,
                    text : userName,
                    height : 35,
                    menu : quickmenu
                }
            ];

        workspace.removeDocked(tabBar, false);

        items = [
            tabBar
        ].concat(items);

        // End.
        return new Ext.toolbar.Toolbar({
            id : 'BM-workspace-toolbar',
            items : items
        });
    }
});