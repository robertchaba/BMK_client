/**
 * 
 */
Ext.define('BM.kernel.Contextmenu', {
    requires : [
        'Ext.menu.Menu'
    ],
    /**
     * @private
     * @property {Object} [contextmenus={}] Objecy with all contextmenu's.
     */

    /**
     * @chainable
     */
    initContextmenu : function ()
    {
        var me = this;

        me.contextmenus = {};

        me.collectContextmenus();

        Ext.getBody().on('contextmenu', function (e)
        {
            e.preventDefault();
            me.showContextmenu(e);
            // End.
        }, me);

        // End.
        return true;
    },
    /**
     * @chainable
     */
    setContextmenus : function (contextmenus)
    {
        var me = this;
        me.contextmenus = contextmenus;
        // End.
        return me;
    },
    /**
     * @chainable
     */
    addContextmenu : function (contextmenu)
    {
        var me = this,
            menus = me.contextmenus,
            el,
            items,
            menu;

        Ext.Object.each(contextmenu, function (el, menu)
        {
            if (!menus.hasOwnProperty(el)) {
                menus[el] = menu;
            } else {
                menus[el] = menus[el].concat(menu);
            }
        }, me);

        // End.
        return me;
    },
    /**
     * 
     */
    getContextmenus : function ()
    {
        var me = this;
        // End.
        return me.contextmenus;
    },
    /**
     * @chainable
     */
    showContextmenu : function (e)
    {
        var me = this,
            menu = me.findContextmenu(e);

        if (!menu || !menu.isMenu) {
            // End.
            BM.getApplication().logInfo('Menu in not a menu instance', {
                event : e,
                menu : menu
            });
            return false;
        }

        // Add the contextmenu terget.
        menu.contextmenuTarget = e.getTarget();

        menu.showAt(e.getXY());

        // End.
        return true;
    },
    /**
     * @chainable
     */
    collectContextmenus : function ()
    {
        var me = this,
            controllers = BM.getApplication().getAllowedControllers();

        controllers.each(function (name, controller)
        {
            me.addContextmenu(controller.getContextmenus());
            // End.
        }, me);

        // End.
        return me;
    },
    /**
     * 
     */
    findContextmenu : function (e)
    {
        var me = this,
            menus = me.contextmenus,
            menu = false;

        Ext.Object.each(menus, function (target, menuItems)
        {
            var els = [// Elements
                Ext.fly(target)
            ];

            Ext.Array.each(Ext.ComponentQuery.query(target), function (cmp)
            {
                if (cmp && cmp.isComponent) {
                    els.push(cmp.getId());
                }
            }, me);

            Ext.Array.each(els, function (el)
            {
                if (el && e.within(el, false, true)) {
                    menu = menus[target];

                    if (!menu || !menu.isMenu) {
                        menu = menus[target] = me.createContextmenu(menuItems);
                    }

                    // End.
                    return;
                }
                // End.
            }, me);
            // End.
        }, me);

        // End.
        return menu;
    },
    /**
     * 
     */
    createContextmenu : function (items)
    {
        // End.
        return new Ext.menu.Menu({
            items : items
        });
    }
});