/**
 * Abstract NS grid which defines grid helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Grid', {
    extend : 'Ext.grid.Panel',
    /**
     * @cfg {Boolean} editable
     * True to add the {@link Ext.grid.plugin.RowEditing} plugin.
     */

    /**
     * @cfg {Object} {@link Ext.grid.plugin.RowEditing} configuration.
     */
    editConfig : {
        clicksToMoveEditor : 1,
        errorSummary : false
    },
    /**
     * @property {BM.kernel.ns.Toolbar} gridToolbar Grid toolbar instance.
     */

    /**
     * @property {Boolean} isNSGrid true to identify this class as namespace grid panel.
     */
    isNSGrid : true,
    /**
     * @inheritdoc
     */
    id : 'nsGrid',
    /**
     * @inheritdoc
     */
    iconCls : 'icon-bug',
    /**
     * @inheritdoc
     */
    title : 'NS grid title',
    /**
     * @inheritdoc
     */
    emptyText : 'No data loaded.', // TEXT
    /**
     * @inheritdoc
     */
    allowDeselect : false, // DEBUG
    /**
     * @inheritdoc
     */
    forceFit : true,
    /**
     * Grid toolbar configuration
     * 
     * @private
     * @cfg {Object} toolbarCfg
     */
    toolbarCfg : {
        paging : false,
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

        me.callParent();

        // End.
        return true;
    },
    initRowEditing : function (config)
    {
        var me = this,
            plugin;

        config = config || me.editConfig;
        plugin = Ext.create('Ext.grid.plugin.RowEditing', config);

        me.addPlugin(plugin);
    },
    /**
     * TODO
     */
    selectRow : function (rowId)
    {
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
            store.add(model);
        }
        me.getView().refresh();

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
     * @param {Sting} [prefix] Destination model field name prefix.
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

        if (config && config.search) {
            toolbar.addSearchColumns(me.columns);
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
    }
});
