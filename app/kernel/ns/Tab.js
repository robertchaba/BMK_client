/**
 * Add common used functionalities (helpers) to the basic {@link Ext.tab.Panel tabPanel}
 * for added Form's and Grid's
 *
 * ## {@link BM.kernel.ns.Form Form}
 * {@link Ext.tab.Panel#buttons} who have {@link Ext.Component#formBind} set to
 * true will be enabled/disabled depending on the validity state of all forms in
 * this tabpanel.
 * 
 * ## {@link BM.kernel.ns.Grid Grid}
 * ...
 *
 * @abstract
 */
Ext.define('BM.kernel.ns.Tab', {
    extend : 'Ext.tab.Panel',
    /**
     * @property {Boolean} isNSTab true to identify this class as namespace tab panel.
     */
    isNSTab : true,
    /**
     * @inheritdoc
     */
    id : 'nsTab',
    /**
     * @inheritdoc
     */
    iconCls : 'icon-bug',
    /**
     * @inheritdoc
     */
    title : 'NS tab title',
    /**
     * @inheritdoc
     */
    activeTab : 0,
    /**
     * @inheritdoc
     * @chainable
     */
    initComponent : function ()
    {
        var me = this;

        me.callParent();
        me.initBoundItems();
        me.onFormValidityChange();

        // End.
        return me;
    },
    /**
     * Return all added {@link BM.kernel.ns.Form NSForm}panels.
     *
     * @return {Array} Array with all form's.
     */
    getNSForms : function ()
    {
        var me = this,
            forms = [];

        me.items.each(function (item)
        {
            if (item.isNSForm) {
                forms.push(item);
            }

            // End.
        }, me);

        // End.
        return forms;
    },
    /**
     * Returns true if none of the added form fields are invalid, false otherwise.
     * 
     * @return {Boolean}
     */
    isValid : function ()
    {
        var me = this,
            forms = me.getNSForms(),
            isValid = true;

        Ext.Array.each(forms, function (form)
        {
            if (form.hasInvalidField()) {
                isValid = false;
            }
            // End.
        }, me);

        // End.
        return isValid;
    },
    /**
     * Return all {@link BM.kernel.ns.Model NSModels} found in all added
     * {@link #getNSForms forms}.
     * 
     * @param {Boolean} update {@link BM.kernel.ns.Form#getModel}
     * @return {Object} Object with all found models the object keys are the 
     *                  concat names of the model.
     */
    getNSModels : function (update)
    {
        var me = this,
            forms = me.getNSForms(),
            models = {};

        Ext.Array.each(forms, function (form)
        {
            var model = form.getModel(update),
                names = model.modelName.split('.'),
                name;
                
            delete names[1];
            name = Ext.String.uncapitalize(names.join(''));
            models[name] = model;
            // End.
        }, me);

        // End.
        return models;
    },
    /**
     * 
     */
    loadModel : function (child, config)
    {
        var me = this,
            tabbar = me.getTabBar(),
            form = me.child('#' + child),
            scope = config.scope,
            callback = config.callback,
            model;

        if (!form || !form.isNSForm) {
            // End.
            BM.getApplication()
                .logError('Unable to load a model from a tab item which is not a NSForm', {
                child : child,
                form : form
            });
            return false;
        }
        
        tabbar.disable();

        // TODO Show all loadmasks or disable tabs while loading

        config.scope = me;
        config.callback = function ()
        {
            model = form.getModel();
            Ext.callback(callback, scope, [model]);
            tabbar.enable();
            // End.
        };

        form.loadModel(config);
    },
    /**
     * This method is called when one of the form panels validity changes.
     * Once called all form's validity are checked.
     * If all form's are valid, all {@link Ext.Component.formBind bound} items
     * will be enabled.
     *
     * @private
     * @chainable
     */
    onFormValidityChange : function ()
    {
        var me = this,
            boundItems = me.getBoundItems(),
            isValid = me.isValid();

        boundItems.each(function (item)
        {
            if (item.disabled === isValid) {
                item.setDisabled(!isValid);
            }
        }, me);

        // End.
        return me;
    },
    /**
     * Returns all found {@link Ext.Component#formBind} items.
     *
     * @private
     * @return {Ext.util.MixedCollection}
     */
    getBoundItems : function ()
    {
        var me = this,
            boundItems = me.boundItems;

        if (!boundItems || boundItems.getCount() === 0) {
            boundItems = me.boundItems = new Ext.util.MixedCollection();
            boundItems.addAll(me.query('[formBind]'));
        }

        return boundItems;
    },
    /**
     * Add validitychange listeners to all {@link BM.kernel.ns.Form NSFormpanels}.
     *
     * @private
     * @chainable
     */
    initBoundItems : function ()
    {
        var me = this,
            forms = me.getNSForms();

        // Collect all bound items.
        Ext.Array.each(forms, function (form)
        {
            form.on('validitychange', me.onFormValidityChange, me);
        });

        // End.
        return me;
    }
});