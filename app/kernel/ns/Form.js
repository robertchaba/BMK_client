/**
 * Abstract NS form which defines form helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Form', {
    extend : 'Ext.form.Panel',
    /**
     * @private
     * @property {BM.kernel.ns.Model} formModel To the form bind model.
     */

    /**
     * @property {Boolean} isNSForm True to identify that this class and all 
     * subclasses can be used as namespace form view.
     */
    isNSForm : true,
    /**
     * @inheritdoc
     */
    id : 'nsForm',
    /**
     * @inheritdoc
     */
    iconCls : 'icon-bug',
    /**
     * @inheritdoc
     */
    title : 'NS form title',
    /**
     * @inheritdoc
     */
    defaultType : 'fieldcontainer',
    /**
     * @inheritdoc
     */
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    padding : '5 0 0 0',
    /**
     * @inheritdoc
     */
    fieldDefaults : {
        labelAlign : 'top',
        labelStyle : 'font-weight:bold',
        labelWidth : 245,
        width : 245,
        inputValue : true,
        uncheckedValue : false,
        typeAhead : true,
        forceSelection : true,
        style : {
            marginRight : '5px',
            marginLeft : '5px'
        }
    },
    /**
     * @inheritdoc
     */
    initComponent : function ()
    {
        var me = this;

        me.addEvents('enter');

        // Submit the form on enter/ return press.
        Ext.apply(me, {
            listeners : {
                afterRender : me.onAfterRender
            }
        });

        me.callParent();

        // End.
        return true;
    },
    /**
     * Resets all fields in this form. By default, any record bound by {@link #loadRecord}
     * will be retained.
     * @param {Boolean} [resetRecord=false] True to unbind any record set
     * by {@link #loadRecord}
     * @return {Ext.form.Basic} this
     */
    reset : function (resetRecord)
    {
        var me = this,
            form = me.getForm();

        // End.
        return form.reset(resetRecord);
    },
    /**
     * Focus a {@link Ext.form.field.Field field} matching the given name.
     * If no field is found, false will be returned, true otherwise.
     * 
     * @param {String} name Field id, name or hiddenName.
     * @return {Boolean} Void.
     */
    focusField : function (name)
    {
        var me = this,
            basic = me.getForm(),
            field = basic.findField(name);

        if (!field) {
            // End.
            BM.getApplication().logError('field is not found', {
                fieldName : name,
                form : me
            });
            return false;
        }

        field.focus();

        // End.
        return true;
    },
    /**
     * Find a specific {@link Ext.form.field.Field} in this form by id or name.
     * 
     * @param {String} id Field id or name.
     * @return {Ext.form.field.Field} The first matching field, or null if none was found.
     */
    findField : function (id)
    {
        var me = this,
            form = me.getForm();
        // End.
        return form.findField(id);
    },
    /**
     * Find a specific {@link Ext.form.field.Field} in this form and set the value.
     * 
     * @param {String} id Field id or name.
     * @param {String} value New value.
     * @return {Boolean} True is fiend is found and value is set, false otherwise.
     */
    setFieldValue : function (id, value)
    {
        var me = this,
            field = me.findField(id);

        if (field.isFormField) {
            field.setValue(value);
            // End.
            return true;
        }

        // End.
        return false;
    },
    /**
     * Binds a {@link BM.kernel.ns.Model model} to the form.  
     * The given model {@link Ext.data.validations validation} settings will be
     * applied to the matching form {@link Ext.form.field.Field fields} and if 
     * the model contains data, this data will be applied to the matching form 
     * fields.
     * 
     * @param {BM.kernel.ns.Model} model
     * @chainable
     */
    setModel : function (model)
    {
        var me = this;

        if (typeof model === 'function') {
            model = model.create();
        }

        if (!model || !model.isNSModel) {
            // End.
            BM.getApplication()
                .logError('Model need to be a instance of BM.kernel.ns.Model', {
                    model : model
                });
            return false;
        }

        me.formModel = model;
        me.applyModelValidations();
        me.applyModelValues();

        // End.
        return me;
    },
    /**
     * Return the bind {@link BM.kernel.ns.Model model}. 
     * 
     * @param {Boolean} update Whether to update the model with the form values 
     *                         before it is returned.
     * @return {Ext.data.Model}
     */
    getModel : function (update)
    {
        update = update || false;

        var me = this,
            model = me.formModel;

        if (!model || !model.isNSModel) {
            // End.
            BM.getApplication()
                .logError('Model need to be a instance of BM.kernel.ns.Model', {
                    model : model
                });
            return false;
        }

        if (update !== false) {
            model.set(me.getValues());
        }

        // End.
        return model;
    },
    /**
     * Load the bind {@link BM.kernel.ns.Model model} instance.  
     * While the model is loading a {@link Ext.LoadMask} will be shown on top of
     * the form.
     * 
     * @param {Object} config The model configuration.
     * @return {Boolean} Void.
     */
    loadModel : function (config)
    {
        config = config || {};

        var me = this,
            model = me.getModel(),
            operation,
            proxy,
            callback;

        if (!model) {
            // End.
            BM.getApplication().logError('No model found to load.', {
                model : model
            });
            return false;
        }

        config = Ext.applyIf(config, {
            action : 'read',
            mitm : {
                scope : me,
                callback : me.onModelLoaded
            }
        });
        config = BM.getApplication().captureCallback(config);
        operation = new Ext.data.Operation(config);
        callback = config.callback;
        proxy = model.getProxy();
        proxy.setConfig(config);
        me.showLoadMask(config);

        model.getProxy().read(operation, callback, me);

        // End.
        return true;
    },
    /**
     * Save the bind {@link BM.kernel.ns.Model model}. While the model is saving a 
     * {@link Ext.LoadMask} will be shown on top of the form.
     * 
     * @param {Object} config The model configuration.
     * @return {Boolean} Void.
     */
    saveModel : function (config)
    {
        config = config || {};

        var me = this,
            model = me.getModel(true);

        if (!model) {
            // End.
            BM.getApplication().logError('No model found to save.', {
                model : model
            });
            return false;
        }

        config = Ext.applyIf(config, {
            mitm : {
                scope : me,
                callback : me.onModelLoaded
            }
        });
        config = BM.getApplication().captureCallback(config);
        me.showLoadMask(config);
        me.disableButtons();

        model.save(config);
        // End.
        return true;
    },
    /**
     * Used to load the store of comboboxes
     * 
     * @param {Ext.form.field.ComboBox} combo
     * @return {Boolean} Void.
     */
    loadStore : function (combo)
    {
        combo.store.load();
        // End.
        return true;
    },
    /**
     * Show a {@link Ext.LoadMask loadMask} on top of the form.
     * 
     * @param {Object} config Loadmask configuration.
     * @return {Boolean} Void.
     */
    showLoadMask : function (config)
    {
        config = config || {};

        var me = this,
            showLoadMask = config.showLoadMask || true,
            loadMaskMsg = config.loadMaskMsg;

        if (config.showLoadMask === false) {
            // End, Configured cancel.
            return false;
        }

        if (loadMaskMsg) {
            config.msg = loadMaskMsg;
        }

        if (showLoadMask) {
            me.setLoading(config, true);
        }

        // End.
        return true;
    },
    /**
     * Hide the {@link Ext.LoadMask loadMask}.
     * 
     * @return {Boolean} Void.
     */
    hideLoadMask : function ()
    {
        var me = this;

        me.setLoading(false);

        // End.
        return true;
    },
    /**
     *  Disable all in the bottom docked {@link Ext.from.Panel#buttons buttons}.
     * 
     *  @return {Boolean} Void.
     */
    disableButtons : function ()
    {
        var me = this,
            buttonsToolbar = me.getDockedItems('[dock=bottom]')[0];

        if (buttonsToolbar && buttonsToolbar.items) {
            buttonsToolbar.items.each(function (button)
            {
                button.disable();
                // End.
            });
        }

        // End.
        return true;
    },
    /**
     * Enable all in the bottom docked {@link Ext.from.Panel#buttons buttons}.
     * 
     * @return {Boolean} Void.
     */
    enableButtons : function ()
    {
        var me = this,
            buttonsToolbar = me.getDockedItems('[dock=bottom]')[0];

        buttonsToolbar.items.each(function (button)
        {
            button.enable();
            // End.
        });

        // End.
        return true;
    },
    /**
     * Handle the loaded or saved model after the request is complete.
     * 
     * @private
     * @param {BM.kernel.ns.Model} model
     * @return {Booleand} Void.
     */
    onModelLoaded : function (model)
    {
        var me = this,
            operations,
            records;

        // Model can be a dataModel, Operation or dataBatch
        if (model instanceof Ext.data.Batch) {
            operations = model.operations;
            model = (operations && operations.length > 0)
                ? operations[0]
                :
                null;
        }

        if (model instanceof Ext.data.Operation) {
            records = model.getRecords();
            model = (records && records.length > 0)
                ? records[0]
                : null;
        }

        me.hideLoadMask();

        if (!model) {
            BM.getApplication()
                .logNotice('Model is loaded but does not contain data', {
                    model : model
                });
            // End.
            return false;
        }

        // This breaks the Login window, and form applyValidations with formBind.
//        me.enableButtons();
        me.setModel(model);

        // End.
        return true;
    },
    /**
     * Apply the model {@link Ext.data.Model#validations} to all matching form
     * fields.   The following field properties can be updated:
     * - allowBlank
     * - minValue / minLength
     * - maxValue / maxLength
     * - vtype
     * - regex
     * 
     * @private
     * @return {Boolean} Void.
     */
    applyModelValidations : function ()
    {
        var me = this,
            basic = me.getForm(),
            model = me.getModel(),
            validations = model.validations || [],
            target,
            field;

        Ext.Array.each(validations, function (validation)
        {
            field = basic.findField(validation.field);

            if (!field) {
                // End iteration.
                return;
            }

            switch (validation.type) {
                case 'presence':
                    field.allowBlank = false;
                    field.afterLabelTextTpl = '*';
                    break;
                case 'length':
                    target = (Ext.isDefined(field.maxValue) || Ext.isDefined(field.minValue))
                        ?
                        'Value'
                        :
                        'Length';

                    if (validation.min) {
                        field['min' + target] = validation.min;
                        field.afterLabelTextTpl = '*';
                    }

                    if (validation.max) {
                        field['max' + target] = validation.max;
                    }
                    break;
                case 'email':
                    field.vtype = 'email';
                    field.afterLabelTextTpl = '*';
                    break;
                case 'format':
                    field.regex = validation.matcher;
                    field.afterLabelTextTpl = '*';
                    break;
            }
            // End.
        });

        // End.
        return true;
    },
    /**
     * Apply the {@link Ext.data.Model model} data to all matching form 
     * {@link Ext.form.field.Field fields}.
     * 
     * @private
     * @param {Mixed} [data] 
     * @return {Boolean} Void.
     */
    applyModelValues : function (data)
    {
        var me = this,
            basic = me.getForm(),
            model = me.getModel();

        if (data && !model) {
            basic.setValues(data);
        } else {
            basic.setValues(model.getData());
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     */
    onAfterRender : function ()
    { // TODO make sure the enter event is not fired when the form item is multiline like textarea.
        var me = this;

        Ext.create('Ext.util.KeyNav', me.el, {
            scope : me,
            enter : function (e)
            {
                me.fireEvent('enter', e);
                // End.
            }
        });
    }
});