/**
 * Abstract NS controller which defines controller helper methods and default 
 * configuration to make the parent controller code shorter and easier to maintain.
 *
 * @abstract
 */
Ext.define('BM.kernel.ns.Controller', {
    /*
     * Add a method action
     * assume that this method gets a event from the navigation
     * if so depart the item id and call the action.
     */
    extend : 'Ext.app.Controller',
    /**
     * @property {Boolean} isNSController True to identify that this class and
     * all subclasses can be used as namespace controllers.
     */
    isNSController : true,
    /**
     * @property {Object} contextmenus 
     * {@link Ext.menu.Menu} contextmenu configuration.
     */
    contextmenus : {},
    /**
     * Add {@link #contextmenus} configuration.
     *
     * @param {Object} contextmenus.
     * @return {Boolean} Void.
     */
    addContextmenus : function (contextmenus)
    {
        var me = this;
        me.contextmenus = contextmenus;
        // End.
        return true;
    },
    /**
     * Returns {@link #contextmenus} configuration.
     *
     * @return {Object} contextmenu configurations.
     */
    getContextmenus : function ()
    {
        var me = this;
        // End.
        return me.contextmenus || {};
    },
    /**
     * Add {@link BM.view.portal.Portlet portlets}'s tot the given
     * {@link BM.view.portal.Panel portal}.  This method is called after, the
     * namespace where this controller belongs to, is activated.
     *
     * @template
     * @param {BM.view.portal.Panel} portal
     * @return {Boolean} Void.
     */
    onPortal : function (portal)
    {
    },
    /**
     * TODO Review comment.
     * Maximize a {@link BM.view.portal.Portlet portlet} to the viewport center.
     * This method will be called, if the controller is dispatched without
     * action method.
     *
     * @template
     * @return {Boolean} Void.
     */
    onDispatch : function ()
    {
    },
    /**
     * Returns the current controller name, not the controller full classname.
     *
     * @return {String} String after the last dot in the current classname..
     */
    getControllerName : function ()
    {
        var me = this,
            fullname = me.self.getName(),
            nameSegments = fullname.split('.');

        // End, return the controller name.
        return nameSegments.pop();
    },
    /**
     * Dispatch a controller action.
     * 
     * This method can be used to call a controller action method based on a
     * component id property. The component id is converted to a method name and
     * if this method name exists on the current controller this method will be
     * called.
     * 
     * @param {Ext.menu.Item} item Clicked item.
     * @param {Ext.EventObject} event Click event.
     */
    dispatchAction : function (item, event)
    {
        var me = this,
            itemId = item.id,
            remove = /^BM-navigation-/,
            parentName = me.getControllerName().toLowerCase(),
            segments,
            ns,
            controller,
            action,
            actionMethod;

        itemId = itemId.replace(remove, '');

        if (!itemId) {
            // End.
            BM.getApplication()
                .logError('Dispatchable item does not contain a ID.', {
                    item : item
                });
            return false;
        }

        segments = itemId.split('-');

        switch (segments.length) {
            case 1:
                // TODO show the ns portal.
                ns = segments[0];
                // End.
                return false;
            case 2:
                ns = segments[0];
                controller = segments[1];
                action = 'dispatch';
                break;
            case 3:
                ns = segments[0];
                controller = segments[1];
                action = segments[2];
                break;
            default:
                // End.
                BM.getApplication()
                    .logError('Dispatchable item contains a invalid ID.', {
                        item : item
                    });
                return false;
        }

        if (parentName !== controller) {
            // End.
            BM.getApplication()
                .logWarning('Try to dispatch a action from a other model', {
                    parent : parentName,
                    controller : controller,
                    action : action
                });
//            return false;
        }

        actionMethod = 'on' + Ext.String.capitalize(action);
        if (!me[actionMethod] || typeof me[actionMethod] !== 'function') {
            // End.
            BM.getApplication()
                .logError('Dispatchable action not found in class', {
                    ns : ns,
                    controller : controller,
                    actionMethod : actionMethod
                });
            return false;
        }

        BM.getApplication().activateNavigation(itemId);
        me[actionMethod](event);

        // End.
        return true;
    },
    /**
     * COMMENTME
     */
    disableComponent : function (component)
    {
        if (!component || (typeof component.disable !== 'function')) {
            // End.
            return false;
        }

        component.disable();

        // End.
        return true;
    },
    loadComponentStore : function (component)
    {
        if (component && component.store && component.store.isStore && !component.store.loaded) {
            component.store.load();
            component.store.loaded = true;
        }
        // End.
        return true;
    },
    /**
     * Returns the current controller namespace.
     *
     * @return {String} Controller namespace or an empty string if the
     *                  controller class name, not include a namespace.
     */
    getNS : function ()
    {
        var me = this,
            fullname = me.self.getName(),
            nameSegments = fullname.split('.'),
            sLen = nameSegments.length;

        if (3 !== sLen) {
            // End, No namespace found.
            BM.getApplication().logNotice('No namespace found', {
                controllerName : fullname
            });
            return '';
        }

        // End, return the namespace.
        return nameSegments[0];
    },
    /**
     * @param {String} name Controller name
     * @param {String} ns Controller namespace
     * @return {BM.kernel.ns.Controller} NS Controller instance.
     */
    getNSController : function (name, ns)
    {
        var me = this,
            controller;

        ns = ns || me.getNS();

        if (typeof name !== 'string') {
            // End.
            BM.getApplication().logError('No controller classname given.', {
                modelName : name
            });
            return false;
        }

        name = ns + '.controller.' + name;
        controller = me.getController(name);

        if (!controller || !(controller.isNSController || controller.prototype.isNSController)) {
            // End.
            BM.getApplication().logError('NSController is not loaded.', {
                controllerName : name
            });
            return false;
        }

        // End.
        return controller;
    },
    /**
     * Returns a {@link BM.kernel.ns.Model model} class, matching the given name
     * for the current controller namespace.
     *
     * @param {String} name of the model.
     * @param {Object} config The model configuration.
     * @return {BM.kernel.ns.Model} Reference to the model contructor.
     */
    getNSModel : function (name, config)
    {
        var me = this,
            model;

        if (typeof name !== 'string') {
            // End.
            BM.getApplication().logError('No model classname given.', {
                modelName : name
            });
            return false;
        }

        name = me.getNS() + '.model.' + name;
        model = me.getModel(name);
        if (!model || !(model.isNSModel || model.prototype.isNSModel)) {
            // End.
            BM.getApplication().logError('NSModel is not loaded.', {
                modelName : name
            });
            return false;
        }

        if (config) {
            model = model.create(config);
        }

        // End.
        return model;
    },
    /**
     * Returns a {@link BM.kernel.ns.Store store} class, matching the given name
     * for the current controller namespace.
     *
     * @param {String} name of the store.
     * @param {Object} config The store configuration.
     * @return {BM.kernel.ns.Store} Reference to the store contructor.
     */
    getNSStore : function (name, config)
    {
        var me = this,
            store;

        if (typeof name !== 'string') {
            // End.
            BM.getApplication().logError('No store classname given', {
                storeName : name
            });
            return false;
        }

        name = me.getNS() + '.store.' + name;

        store = me.getStore(name);

        if (!store || !(store.isNSStore || store.prototype.isNSStore)) {
            // End.
            BM.getApplication().logError('NSStore is not loaded', {
                storeName : name
            });
            return false;
        }

        if (config) {
            store = store.create(config);
        }

        // End.
        return store;
    },
    /**
     * Returns a {@link BM.kernel.ns.Panel panel} view, matching the given name
     * for the current controller namespace.
     *
     * @param {String} name Name of the panel.
     * @param {Object|Boolean} [config] The panel configuration or true to create a instance.
     * @return {BM.kernel.ns.Panel} Panel class or instance if config is given.
     */
    getNSPanel : function (name, config)
    {
        var me = this,
            panel = me.getNSView(name, 'panel');

        if (!panel.prototype.isNSPanel) {
            // End.
            BM.getApplication().logError('Panel is not a NSPanel.', {
                panel : panel
            });
        }

        if (!config) {
            // End.
            return panel;
        }

        panel = panel.create(config);

        // End.
        return panel;
    },
    /**
     * Returns the {@link BM.kernel.ns.Grid grid} view, matching the given name for
     * the current controller namespace.
     *
     * @param {String} name Name of the grid.
     * @param {Object|Boolean} [config] The grid configuration or true to create a instance.
     * @return {BM.kernel.ns.Grid} Grid class or instance if config is given.
     */
    getNSGrid : function (name, config)
    {
        var me = this,
            grid = me.getNSView(name, 'grid'),
            toolbar;

        if (!grid.prototype.isNSGrid) {
            // End.
            BM.getApplication().logError('Grid is not a NSGrid.', {
                grid : grid
            });
        }

        if (!config) {
            // End.
            return config;
        }

        grid = grid.create(config);

        if (grid.isNSGrid && grid.toolbarCfg) {
            toolbar = me.getNSToolbar(name, grid.getToolbarCfg());
            grid.setToolbar(toolbar);
        }

        // End.
        return grid;
    },
    /**
     * Returns the {@link BM.kernel.ns.Toolbar toolbar} view, matching the given
     * name for the current controller namespace.
     *
     * @param {String} name Name of the toolbar.
     * @param {Object|Boolean} [config] The toolbar configuration or true to create a instance.
     * @return {BM.kernel.ns.Toolbar} Toolbar class or instance if config is given.
     */
    getNSToolbar : function (name, config)
    {
        config = config || {};

        var me = this,
            toolbar = me.getNSView(name, 'toolbar'),
            ns = me.getNS(),
            controllerName = me.getControllerName(),
            app = BM.getApplication(),
            addAllowed = toolbar.prototype.allowedButtons,
            items,
            allowedItems;

        if (!toolbar.prototype.isNSToolbar) {
            // End.
            BM.getApplication().logError('Toolbar is not a NSToolbar.', {
                toolbar : toolbar
            });
        }
        
        items = toolbar.prototype.items;
        
        if (addAllowed !== false) {
            if (Ext.isString(addAllowed)) {
                controllerName = addAllowed;
            }
            allowedItems = app.getAllowedToolbar(ns, controllerName.toLowerCase());
            items = (toolbar.prototype.beforeAllowed) ? 
                Ext.Array.merge(items, allowedItems) : 
                Ext.Array.merge(allowedItems, items);
        }

        if (config) {
            toolbar = toolbar.create({
                paging : config.paging,
                store : config.store,
                search : config.search,
                items : items
            });
        }

        // End.
        return toolbar;
    },
    /**
     * Returns the {@link BM.kernel.ns.Form form} view, matching the given name for
     * the current controller namespace.
     *
     * @param {String} name Name of the form.
     * @param {Object|Boolean} [config] The form configuration or true to create a instance.
     * @return {BM.kernel.ns.Form} Form class or instance if config is given.
     */
    getNSForm : function (name, config)
    {
        var me = this,
            form = me.getNSView(name, 'form'),
            model;

        if (!form.prototype.isNSForm) {
            // End.
            BM.getApplication().logError('Form is not a NSForm.', {
                form : form
            });
        }

        if (!config) {
            // End.
            return form;
        }

        form = form.create(config);

        if (config.model) {
            model = config.model;
        }

        if (typeof model === 'string') {
            model = me.getNSModel(model);
        }

        if (typeof model === 'function') {
            model = model.create();
        }

        if (model && model.isNSModel) {
            form.setModel(model);
        }

        // End.
        return form;
    },
    /**
     * Returns the {@link BM.kernel.ns.Window window} view, matching the given name
     * for the current controller namespace.
     *
     * @param {String} name Name of the window.
     * @param {Object|Boolean} [config] The window configuration or true to create a instance.
     * @return {BM.kernel.ns.Window} Window class or instance if config is given.
     */
    getNSWindow : function (name, config)
    {
        var me = this,
            NSWindow = me.getNSView(name, 'window');

        if (!NSWindow.prototype.isNSWindow) {
            // End.
            BM.getApplication().logError('Window is not a NSWindow.', {
                NSWindow : NSWindow
            });
        }

        if (!config) {
            // End.
            return NSWindow;
        }

        NSWindow = NSWindow.create(config);

        // End.
        return NSWindow;

    },
    /**
     * Shows the {@link BM.kernel.ns.Window window} view matching the given name
     * for the current controller namespace.
     *
     * @param {String} name Window filename.
     * @param {Ext.panel.Panel} panel Add a panel to this Window.
     * @return {Boolean}
     */
    showNSWindow : function (name, panel)
    {
        var me = this,
            NSWindow;

        if (name.isPanel || typeof name === 'function') {
            panel = name;
            name = 'Window';
        }

        if ((typeof panel === 'string')) {
            panel = me.getNSPanel(panel);
        }

        if (typeof panel === 'function') {
            panel.create();
        }

        if (!panel.isPanel) {
            // End.
            BM.getApplication().logError('Panel is not loaded', {
                windowName : name,
                panel : panel
            });
            return false;
        }

        NSWindow = me.getNSWindow(name, {
            title : panel.title,
            iconCls : panel.iconCls
        });

        panel.title = '';
        panel.iconCls = '';

        NSWindow.add(panel);
        NSWindow.show();

        // End.
        return true;
    },
    /**
     * Hide the given {@link Ext.Component component} parent window.
     * 
     * @param {Ext.Component} windowChild Used to find the window.
     * @return {Boolean} Void.
     */
    hideNSWindow : function (windowChild)
    {
        if (!windowChild.isComponent) {
            // End, TODO throw a error, windowChild is not a component.
            BM.getApplication()
                .logError('Given window child is not a valid component', {
                    windowChild : windowChild
                });
            return false;
        }

        windowChild.up('window').close();

        // End.
        return true;
    },
    /**
     * Returns the {@link BM.kernel.ns.Tab tab} view, matching the given name for
     * the current controller namespace.
     *
     * @param {String} name Name of the tab.
     * @param {Object} [config] The tab configuration.
     * @return {BM.kernel.ns.Tab} Tab class or instance if config is given.
     */
    getNSTab : function (name, config)
    {
        var me = this,
            tab = me.getNSView(name, 'tab');

        if (!tab.prototype.isNSTab) {
            // End.
            BM.getApplication().logError('Tab is not a NSTab.', {
                tab : tab
            });
        }

        if (config) {
            tab = tab.create(config);
        }

        // End.
        return tab;
    },
    /**
     * Returns the view class, matching the given name and type for the current
     * controller namespace.
     *
     * @private
     * @param {String} name View filename.
     * @param {String} [type=panel] View type.
     * @return {BM.kernel.ns.Panel}
     */
    getNSView : function (name, type)
    {
        type = type || 'panel';

        // Make sure name is an string.
        if (!Ext.isString(name)) {
            name = '';
        }

        var me = this,
            view,
            viewId;

        name = me.getNS() + '.view.' +
            me.getControllerName().toLowerCase() + '.' +
            type + '.' +
            Ext.String.capitalize(name.toLowerCase());
        view = me.getView(name);

        if (!view) {
            // End.
            BM.getApplication().logError('View is not loaded.', {
                viewName : name
            });
            return false;
        }

        viewId = view.prototype.id;
        if (Ext.ComponentManager.all.containsKey(viewId)) {
            BM.getApplication()
                .logWarning('View is already registered. The old view will be destroyed to prevent error\'s.', {
                    viewId : viewId
                });

            Ext.ComponentManager.get(viewId).destroy();
        }

        // End.
        return view;
    }
});
