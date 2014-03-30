/**
 * A {@link BM.App} mixin for setting up and handling common navigation
 * actions.
 */
Ext.define('BM.kernel.Navigation', {
    uses : [
        'Ext.toolbar.Toolbar'
    ],
    /**
     * @private
     * @property {Ext.toolbar.Toolbar} navigation
     * Navigation view instance.
     */

    /**
     * @cfg {String} [navigationAlign="left"]
     * The viewport region where to render the navigation to.  
     * May be "left", "right", "bottom"
     */

    /**
     * @cfg {String} [navigationActiveCls="BM-navigation-active-module"]
     * The active navigation button clls class name.
     */

    /**
     * Create an instance of {@link Ext.toolbar.Toolbar} and add this to the 
     * "right", "bottom" or "left" of the {@link BM.view.Viewport viewport}.
     * 
     * @private
     * @return {Boolean} Void.
     */
    initNavigation : function ()
    {
        var me = this,
            vertical = true,
            region;

        me.navigationAlign = me.navigationAlign || 'left';
        me.navigationActiveCls = 'BM-navigation-active-module';

        switch (me.navigationAlign) {
            case 'top':
                vertical = false;
                region = me.getNorthRegion();
                break;
            case 'bottom':
                vertical = false;
                region = me.getSouthRegion();
                break;
            case 'left':
                region = me.getWestRegion();
                break;
            case 'right':
                region = me.getEastRegion();
                break;
            default:
                // End.
                BM.getApplication().logError('Invalid navigation alignment', {
                    align : me.navigationAlign
                });
                // End.
                return false;
        }

        me.navigation = me.createNavigation(vertical);

        region.removeAll();
        region.add(me.navigation);
        me.navigation.getEl().slideIn('l', {
            duration : 50
        });

        // End.
        return true;
    },
    destroyNavigation : function ()
    {
        var me = this;

        me.navigation.getEl().slideOut('l', {
            duration : 50,
            callback : function ()
            {
                me.navigation.destroy();
            }
        });

        // End.
        return true;
    },
    /**
     * Set a {Ext.toolbar.Toolbar navigation} instance.
     * 
     * @param {Ext.toolbar.Toolbar} navigation Navigation instance.
     * @chainable
     */
    setNavigation : function (navigation)
    {
        var me = this;
        me.navigation = navigation;
        // End.
        return me;
    },
    /**
     * Return a {@link Ext.toolbar.Toolbar navigation}.
     * 
     * A {@link #createNavigation navigation} instance is created if not navigation is defined.
     * 
     * @return {Ext.toolbar.Toolbar} Navigation view instance.
     */
    getNavigation : function ()
    {
        var me = this;
        me.navigation = me.navigation || me.createNavigation();
        // End.
        return me.navigation;
    },
    /**
     * Return a {Ext.toolbar.Toolbar navigation} instance.
     * 
     * This navigation is used to display the application navigation.
     * 
     * @private
     * @param {Boolean} vertical True if the navigation verticalneed to be rendered. 
     * @return {Ext.toolbar.Toolbar} Navigation instance.
     */
    createNavigation : function (vertical)
    {
        vertical = vertical || true;

        var logo = BM.getApplication().getApplicationLogo(),
            items = BM.getApplication().getAllowedNavigation();

        items = Ext.Array.merge([
            logo
        ], items);

        // End.
        return new Ext.toolbar.Toolbar({
            id : 'BM-navigation',
            vertical : vertical,
            height : vertical ? '100%' : undefined,
            defaults : {
                arrowAlign : 'bottom',
                iconAlign : 'top',
                scale : 'medium'
            },
            items : items
        });
    },
    /**
     * COMMENTME
     * 
     * @private
     * @param {String} id Navigation item element id. 
     * @return {Boolean} Void.
     */
    activateNavigation : function (id)
    {
        id = 'BM-navigation-' + id.split('-', 1).toString();

        var me = this,
            items = me.navigation.items,
            item = items.get(id);

        if (!item) {
            // End, No navigation items found.
            BM.getApplication().logError('No navigation item found.', {
                items : items,
                id : id
            });
            return false;
        }

        me.clearActiveNavigation();

        item.addCls(me.navigationActiveCls);
        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    clearActiveNavigation : function ()
    {
        var me = this;

        me.navigation.items.each(function (navItem)
        {
            if (navItem.hasCls(me.navigationActiveCls)) {
                navItem.removeCls(me.navigationActiveCls);
            }
        }, me);

        // End.
        return true;
    }
});