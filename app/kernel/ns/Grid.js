/**
 * Abstract NS grid which defines grid helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Grid', {
    extend : 'Ext.grid.Panel',
    requires : [
        'Ext.grid.plugin.RowEditing',
        'Ext.ux.grid.FilterBar'
    ],
    /**
     * @cfg {Boolean} editable
     * True to activate the {@link Ext.grid.plugin.RowEditing} plugin.
     */

    /**
     * @cfg {Object} {@link Ext.grid.plugin.RowEditing} configuration.
     */
    editConfig : {
        clicksToMoveEditor : 1,
        errorSummary : false
    },
    /**
     * @cfg {Boolean} filterable
     * True to activate the {@link Ext.ux.grid.FilterBar} plugin.
     */

    /**
     * @cfg {Object} {@link Ext.ux.grid.FilterBar} configuration.
     */
    filterConfig : {
        renderHidden : true,
        showShowHideButton : false,
        showClearAllButton : false
    },
    /**
     * @property {BM.kernel.ns.Toolbar} gridToolbar Grid toolbar instance.
     */

    /**
     * @property {Boolean} isNSGrid true to identify this class as namespace grid panel.
     */
    isNSGrid : true,
    id : 'nsGrid',
    iconCls : 'icon-bug',
    title : 'NS grid title',
    emptyText : 'No data loaded.', // TEXT
    allowDeselect : false, // DEBUG
    forceFit : true,
    /**
     * Grid toolbar configuration
     * 
     * @cfg {Object} toolbarCfg
     */
    toolbarCfg : {
        paging : false,
        remove : [
        ],
        disable : [
        ],
        toggleOnSelectionchange : [
        ]
    },
    /**
     * @inheritdoc
     */
    initComponent : function ()
    {
        var me = this;

        if (me.editable) {
            me.initRowEditing(me.editConfig);
        }

        if (me.filterable) {
            me.initFilterBar(me.filterConfig);
        }

        me.callParent();

        // End.
        return true;
    },
    /**
     * 
     */
    initRowEditing : function (config)
    {
        var me = this,
            plugin;

        config = config || me.editConfig;
        plugin = Ext.create('Ext.grid.plugin.RowEditing', config);

        me.addPlugin(plugin);
    },
    /**
     * 
     */
    initFilterBar : function (config)
    {
        var me = this,
            plugin;

        config = config || me.filterConfig;
        plugin = Ext.create('Ext.ux.grid.FilterBar', config);

        me.addPlugin(plugin);
    },
    /**
     * 
     */
    getLastSelected : function ()
    {
        var me = this;
        // End.
        return me.getSelectionModel().getLastSelected();
    },
    /**
     * TODO
     */
    selectRow : function (model)
    {
        var me = this;
        return me.getSelectionModel().select(model);
    },
    /**
     * TODO
     */
    editRow : function ()
    {
        var me = this,
            selectionModel = me.getSelectionModel().getLastSelected(),
            plugin = me.findPlugin('rowediting');

        plugin.cancelEdit();
        plugin.startEdit(selectionModel, 0);
    },
    /**
     * Add a model, to the store bind to this grid.
     *
     * @param {BM.kernel.ns.Model} model
     * @chainable
     */
    addModel : function (model)
    {
        var me = this,
            store = me.getStore(),
            i;

        if (!model || !model.isNSModel) {
            // End.
            BM.getApplication()
                .logError('Model need to be a instance of BM.kernel.ns.Model.', {
                    model : model
                });
            return false;
        }
        i = store.find('id', model.getId());

        if (i >= 0) {
            store.removeAt(i);
            store.insert(i, model);
        } else {
            store.insert(0, model);
        }

        store.commitChanges();
        me.getView().refresh();
        me.selectRow(model);

        // End.
        return me;
    },
    /**
     * Tries to find the record in the grid store matching the id from the given 
     * model and update all matching fields in the store record with the given 
     * model field values.
     * 
     * @param {BM.kernel.ns.Model} model
     * @param {String} [destFieldname=id] Destination model field name to find the match against.
     * @param {String} [refFieldname=id] Reference model field name.
     * @param {String} [prefix] Destination model field name prefix.
     * @return {Boolean} Void.
     */
    updateModel : function (model, destFieldname, refFieldname, prefix)
    {
        destFieldname = destFieldname || 'id';
        refFieldname = refFieldname || 'id';

        if (prefix) {
            destFieldname = prefix + Ext.String.capitalize(destFieldname);
        }

        var me = this,
            store = me.getStore(),
            refValue = model.get(refFieldname),
            destModel = store.findRecord(destFieldname, refValue),
            fieldName,
            destFields;

        if (!destModel) {
            BM.getApplication()
                .logWarning('Model is not found in the store, maybe a wrong refFieldname or desFieldName', {
                    store : store,
                    refFieldname : refFieldname,
                    destFieldname : destFieldname
                });
        }

        model.fields.each(function (field)
        {
            fieldName = prefix + Ext.String.capitalize(field.name);
            destFields = destModel.fields;

            if ((fieldName === refFieldname) || !destFields.containsKey(fieldName)) {
                // End, field does not exist in the destModel or equals refFieldname.
                return;
            }

            destModel.set(fieldName, model.get(field.name));
            delete destModel.modified[fieldName];
        });
        destModel.commit();
    },
    /**
     * Upodate the grid the the model reader's raw data.
     * 
     * @param {BM.kernel.ns.Model} model
     * @return {Boolean}
     */
    updateModelFromRaw : function (model)
    {
        var me = this,
            store = me.getStore(),
            rawData = model.proxy.reader.rawData,
            result = store.proxy.reader.read(rawData);

        if (!result.success || result.count <= 0) {
            // End, data read faild.
            return false;
        }

        // Update grid row.
        me.addModel(result.records[0]);

        // End.
        return true;
    },
    /**
     * 
     */
    removeModel : function (model)
    {
        var me = this;
        me.getStore().remove(model);
        // End.
        return me;
    },
    /**
     * Set a store and bind it with this grid.
     *
     * @param {BM.kernel.ns.Store} store
     * @chainable
     */
    setStore : function (store)
    {
        if (!store || !store.isNSStore) {
            BM.getApplication()
                .logError('Store need to be a instance of BM.kernel.ns.Store.', {
                    store : store
                });
        }

        var me = this;
        me.store = store;
        me.reconfigure(store);

        // End.
        return true;
    },
    /**
     * Return the, to this grid bind store.
     *
     * @return {BM.kernel.ns.Store} description
     */
    getStore : function ()
    {
        var me = this,
            store = me.store;

        if (!store || !store.isNSStore) {
            BM.getApplication()
                .logError('Store need to be a instance of BM.kernel.ns.Store.', {
                    modelName : name
                });
        }

        // End.
        return store;
    },
    /**
     * Load the store bind to this grid.
     *
     * @param {Object} config
     * @return {Boolean} Void.
     */
    loadStore : function (config)
    {
        config = config || {};

        var me = this,
            store = me.getStore();
        store.load(config);
        // End.
        return true;
    },
    /**
     * Alias of {@link #syncStore}
     *
     * @param {Object} config
     * @return {Boolean} Void.
     */
    saveStore : function (config)
    {
        var me = this;
        me.syncStore(config);
        // End.
        return true;
    },
    /**
     * Synchronise the store bind to this grid.
     *
     * @return {Boolean} Void.
     */
    syncStore : function (config)
    {
        var me = this,
            store = me.getStore();

        store.sync(config);

        // End.
        return true;
    },
    /**
     * TODO
     */
    setToolbarCfg : function (config)
    {
        var me = this;
        me.toolbarCfg = config;
        // End.
        return me;
    },
    /**
     * TODO
     */
    getToolbarCfg : function ()
    {
        var me = this,
            config = me.toolbarCfg || {};

        if (me.store) {
            config.store = me.store;
        }

        // End.
        return config;
    },
    /**
     * Set a toolbar and apply the toolbar configuration.
     * 
     * @param {BM.kernel.ns.Toolbar} toolbar
     * @param {Boolean} [cache=true]
     * @chainable
     */
    setToolbar : function (toolbar, cache)
    {
        cache = cache || true;

        var me = this,
            config = me.toolbarCfg;

        if (!toolbar || !toolbar.isNSToolbar) {
            // End, toolbar should be a NSToolbar.
            return false;
        }

        if (cache) {
            me.gridToolbar = toolbar;
        }
        me.addDocked(toolbar);

        if (config && Ext.isArray(config.disable)) {
            toolbar.disableItems(config.disable);
        }

        if (config && Ext.isArray(config.toggleOnSelectionchange)) {
            toolbar.toggleItemsOnSelectionchnage(config.toggleOnSelectionchange, me);
        }

        // End.
        return me;
    },
    /**
     * TODO
     */
    getToolbar : function ()
    {
        var me = this;
        // End.
        return me.gridToolbar;
    },
    /**
     * 
     * @param {array} items
     * @return {undefined}
     */
    disableToolbarItems : function (items)
    {
        var me = this,
            item;

        items = items || me.toolbarCfg.disable;
        Ext.Array.each(items, function (itemId)
        {
            item = Ext.getCmp(itemId.substr(1));
            if (item) {
                item.disable();
            }
            // End.
        });

        // End.
        return true;
    }
});
