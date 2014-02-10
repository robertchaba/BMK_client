/**
 * A {@link BM.App} mixin for supplying access information and allowed
 * classes or configuration.
 */
Ext.define('BM.kernel.Acl', {
    /**
     * @private
     * @property {Object} allowedControllers
     * Allowed controllers cache.
     */

    /**
     * @private
     * @property {Object} ACLPermissions ACL permissions.
     */

    /**
     * Initialize Access Control List.
     * 
     * @return {Boolean} Void.
     */
    initAcl : function ()
    {
        var me = this;

        me.allowedControllers = new Ext.util.HashMap();
        // Replace all controllers with the allowed controllers

        // End.
        return true;
    },
    /**
     * COMMENTME
     */
    destroyAcl : function ()
    {
        var me = this;

        me.allowedControllers = null;
        me.ACLPermissions = null;

        // End.
        return true;
    },
    /**
     * Set the ACL permissions.
     * 
     * @param {Object} permissions
     * @chainable
     */
    setACLPermissions : function (permissions)
    {
        var me = this;
        me.ACLPermissions = permissions;
        // End.
        return me;
    },
    /**
     * Return the ACL permissions.
     * 
     * @param {String} [module] Module name
     * @param {String} [controller] Controller name 
     * @return {Object} permissions object.
     */
    getACLPermissions : function (module, controller)
    {
        var me = this,
            permissions = Ext.clone(me.ACLPermissions),
            tmp;

        if (!permissions || Ext.Object.isEmpty(permissions)) {
            permissions = {};
        }

        if (module) {
            module = module.toLowerCase();
            tmp = Ext.clone(permissions[module]) || {};
            permissions = {};
            permissions[module] = tmp;

            if (controller) {
                controller = controller.toLowerCase();
                tmp = permissions[module].controllers[controller] || {};
                permissions[module].controllers = {};
                permissions[module].controllers[controller] = tmp;
            }
        }

        // End.
        return permissions;
    },
    /**
     * COMMENTME
     * 
     * TODO rename the params
     * @param {String} resource
     * @param {String} privilge
     * @param {String} assertion
     * @return {Boolean}
     */
    allowed : function (resource, privilge, assertion)
    {
    },
    /**
     * Return a array with all allowed {@link Ext.toolbar.Item navigation items}.  
     * 
     * @return {Array} Navigation items.
     */
    getAllowedNavigation : function ()
    {
        var me = this,
            navigation = me.getAllowedMenu('navigation', 'isNavigation', true);
        // End.
        return navigation;
    },
    /**
     * Return a array with all allowed {@link Ext.menu.Item quickmenu items}.
     * 
     * @return {Array} Quickmenu items. 
     */
    getAllowedQuickmenu : function ()
    {
        var me = this,
            quickmenu = me.getAllowedMenu('quickmenu', 'isQuickmenu', true, 2);

        // End.
        return quickmenu;
    },
    /**
     * COMMENTME
     * 
     * @return {Array} Portlets
     */
    getAllowedPortlets : function ()
    {
        // Use me.getAllowed controllers to get the portlets.
        // I dont think we need this method.
    },
    /**
     * Return a array with all the, for the given module and controller allowed
     * {@link Ext.toolbar.Item toolbar items}.
     * 
     * @param {String} resource 
     * @return {Array} Toolbar items.
     */
    getAllowedToolbar : function (module, controller)
    {
        var me = this,
            toolbar,
            permissions = me.getACLPermissions(module, controller);

        toolbar = me.getAllowedMenu('toolbar', 'isToolbar', true, 2, permissions);

        // End.
        return toolbar;
    },
    /**
     * FIXME
     * 
     * Return a array with all allowed 
     * {@link BM.kernel.ns.Controller controller instances}.  
     * If a module name is given only the controllers in this module will be
     * returned.
     * 
     * @param {String} [module] Modulename.
     * @return {Array} Controllers.
     */
    getAllowedControllers : function (module)
    {
        var me = this,
            modules = me.getACLPermissions(),
            loadedControllers = me.controllers,
            controllers = me.allowedControllers,
            controller;

        if (controllers.getCount() > 0) {
            // End, return cache.
            return controllers;
        }

        Ext.Object.each(modules, function (moduleName, module)
        {
            Ext.Object.each(module.controllers, function (controllerName)
            {
                controllerName = Ext.String.capitalize(moduleName) +
                    '.controller.' + Ext.String.capitalize(controllerName);

                if (!loadedControllers.containsKey(controllerName)) {
                    // End.
                    BM.getApplication().logError('Controller is not loaded.', {
                        controllers : loadedControllers,
                        controller : controllerName,
                        args : {
                            module : module
                        }
                    });
                    return;
                }

                controller = me.getController(controllerName);
                if (controller && controller.isNSController) {
                    controllers.add(controllerName, controller);
                }
                // End.
            }, me);
            // End.
        }, me);

        // End.
        return controllers;
    },
    /**
     * Quite a inpressive pease of code to build a
     * {@link Ext.toolbar.Toolbar toolbar} {@link Ext.toolbar.Toolbar#items items}
     * configuration object from the ACL permissions.
     * 
     * @private
     * @param {String} ns Menu item id namespace.
     * @param {String} flag Allowed flag.
     * @param {String} [value=true] Allowed value.
     * @param {Number} [start=0] Add items >= start.
     * @param {Object} [permissions] ACL permissions.
     * @return {Object} Menu configuration.
     */
    getAllowedMenu : function (ns, flag, value, start, permissions)
    {
        if ((typeof ns !== 'string') || (typeof flag !== 'string')) {
            // End, Missing required values.
            return {};
        }

        value = value || true;
        start = start || 0;

        var me = this,
            menu = [];

        permissions = permissions || me.getACLPermissions();


        start--;
        Ext.Object.each(permissions, function (name, permission)
        {
            var isSubMenu = false,
                subPermissions,
                subMenu,
                item;

            switch (true) {
                case (!!permission.controllers):
                    subPermissions = permission.controllers;
                    break;
                case (!!permission.actions):
                    subPermissions = permission.actions;
                    break;
            }

            item = {
                id : 'BM' + '-' + ns + '-' + name,
                text : permission.label || '',
                iconCls : permission.icon || ''
            };

            if (subPermissions) {
                subMenu = me.getAllowedMenu(ns + ('-' + name), flag, value, start, subPermissions);
            }

            isSubMenu = (subMenu && (subMenu.length > 0));

            if (isSubMenu) {
                if (start >= 0) {
                    item = subMenu;
                } else {
                    item.menu = subMenu;
                }
            }

            if ((!permission[flag] || (permission[flag] !== value)) && !isSubMenu) {
                // End, Flag is not found or doesn't contain the required value and there is no submenu.
                return;
            }

            if (item instanceof Array) {
                menu = menu.concat(item);
            } else {
                menu.push(item);
            }

            // End.
        }, me);

        // End.
        return menu;
    }
});