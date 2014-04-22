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
     * @cfg {Boolean} wizard True to make the tab panel a wizard.
     */
    wizard : false,
    /**
     * @cfg {Number}
     */
    wizardInfoBoardWidth : 150,
    id : 'nsTab',
    iconCls : 'icon-bug',
    title : 'NS tab title',
    activeTab : 0,
    /**
     * @private
     * @property {Ext.XTemplate} infoBoard
     */

    /**
     * @static
     * @property {Boolean} wizard
     * @return {Boolean} Currect value.
     */
    setIsWizard : function (wizard)
    {
        var me = this;
        me.wizard = wizard;
        // End.
        return wizard;
    },
    /**
     * @static
     * @return {Boolean} Currect value.
     */
    getIsWizard : function ()
    {
        var me = this;
        // End.
        return me.wizard;
    },
    /**
     * @inheritdoc
     * @chainable
     */
    initComponent : function ()
    {
        var me = this;

        // Convert this tab panel to a wizard.
        if (me.wizard) {
            me.initWizard();
        } else if (!me.buttons) {
            me.buttons = [
                {
                    text : 'Cancel', // TEXT
                    action : 'cancel'
                },
                {
                    text : 'Save', // TEXT
                    action : 'save',
                    formBind : true
                }
            ];
        }

        me.callParent();

        // Hide the tab bar.
        if (me.wizard) {
            me.tabBar.hide();
        }

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
            forms = [
            ];

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
     * Returns true if none of the added form fields are invalid for all tabs, false otherwise.
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
     * Returns true if none of the added form fields are invalid, false otherwise.
     * 
     * @return {Boolean}
     */
    activeIsValid : function ()
    {
        var me = this,
            active = me.getActiveTab();

        if (!active.isNSForm) {
            // End, is not a NS form, so have no invalid fields.
            return true;
        }

        // End.
        return !active.hasInvalidField();
    },
    /**
     * Return all {@link BM.kernel.ns.Model NSModels} found in all added
     * {@link #getNSForms forms}.
     * 
     * @param {Boolean} update {@link BM.kernel.ns.Form#getModel}
     * @return {Object} Object with all found models the object keys are the 
     *                  concat names of the model.
     */
    getNSModels : function (update) // TODO Update to getModels dont use NS
    {
        var me = this,
            forms = me.getNSForms(),
            models = {};

        Ext.Array.each(forms, function (form)
        {
            var model = form.getModel(update),
                names,
                name;

            if (!model) {
                // End loop.
                return;
            }

            names = model.modelName.split('.');

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
            Ext.callback(callback, scope, [
                model
            ]);
            tabbar.enable();
            // End.
        };

        form.loadModel(config);
    },
    createInfoBoard : function ()
    {
        var me = this;

        me.infoBoard = new Ext.Component({
            width : me.wizardInfoBoardWidth,
            padding : '0 5 5 5',
            tpl : '<h3>{title}</h3>{html}'
        });

        // End.
        return me.infoBoard;
    },
    initWizard : function ()
    {
        var me = this;

        me.buttons = [
            {
                text : 'Cancel', // TEXT
                action : 'cancel'
            },
            {
                text : 'Previous', // TEXT
                action : 'previous',
                disabled : true,
                scope : me,
                handler : me.onPrevious
            },
            {
                text : 'Continue', // TEXT
                action : 'continue',
                formBind : true,
                scope : me,
                handler : me.onContinue
            },
            {
                text : 'Finish', // TEXT
                action : 'finish',
                formBind : true,
                hidden : true
            }
        ];

        me.on('tabchange', me.onTabChange, me);
    },
    /**
     * This method is called when one of the form panels validity changes.
     * Once called all form's validity are checked.
     * If all form's are valid, all {@link Ext.Component#formBind bound} items
     * will be enabled.
     *
     * @private
     * @chainable
     */
    onFormValidityChange : function ()
    {
        var me = this,
            boundItems = me.getBoundItems(),
            isValid = (me.wizard) ?
            me.activeIsValid() :
            me.isValid();

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
    },
    onContinue : function ()
    {
        var me = this,
            active = me.getActiveTab(),
            next = active.nextSibling();

        if (!me.wizard || !next) {
            // End, Error there is no next wizard sibling.
            return false;
        }

        me.setActiveTab(next);
        me.onFormValidityChange();

        // End.
        return true;
    },
    onPrevious : function ()
    {
        var me = this,
            active = me.getActiveTab(),
            prev = active.previousSibling();

        if (!me.wizard || !prev) {
            // End, Error there is no next wizard sibling.
            return false;
        }

        me.setActiveTab(prev);
        me.onFormValidityChange();

        // End.
        return true;
    },
    onTabChange : function ()
    {
        var me = this,
            active = me.getActiveTab(),
            next = active.nextSibling() ? true : false,
            prev = active.previousSibling() ? false : true,
            previousButton,
            nextButton,
            finishButton;

        if (!me.wizard) {
            // End, Not in wizard mode.
            return false;
        }

        previousButton = me.down('[action=previous]');
        nextButton = me.down('[action=continue]');
        finishButton = me.down('[action=finish]');

        previousButton.setDisabled(prev);
        nextButton.setVisible(next);
        finishButton.setVisible(!next);

        me.infoBoard.update({
            title : active.title,
            html : active.wizardInfo || '<p>...</p>'
        });

        // End.
        return true;
    }
});