/**
 * A {@link BM.kernel.ns.Toolbar} mixin for supplying grid search functionality.
 */
Ext.define('BM.ux.grid.FilterTool', {
    /**
     * @property {Ext.data.Store} store
     * The {@link Ext.data.Store} the paging toolbar should use as its data source.
     */

    /**
     * @property {Array} searchColumns
     * Array with all visible searchable {Ext.grid.column.Column Columns} 
     */

    /**
     * COMMENTME
     * 
     * @property {Array} columns
     * @chainable
     */
    setSearchColumns : function (columns)
    {
        var me = this,
            gridSearch = me.down('#grid-search'),
            searchColumnContainer;

        me.searchColumns = columns;

        if (gridSearch && gridSearch.menu) {
            searchColumnContainer = gridSearch.menu.down('checkboxgroup');

            Ext.Array.each(columns, function (column)
            {
                if (column.searchable) {
                    searchColumnContainer.add({
                        name : column.dataIndex,
                        boxLabel : column.text,
                        checked : !column.hidden
                    });
                }
                // End.
            });
        }

        // End.
        return me;
    },
    /**
     * COMMENTME
     * 
     * @return {Array}
     */
    getSearchColumns : function ()
    {
        var me = this;
        // End.
        return me.searchColumns;
    },
    /**
     * COMMENTME
     */
    createSearchMenu : function ()
    {
        var me = this,
            menu = [
                {
                    xtype : 'form',
                    itemId : 'grid-search-form',
                    indent : false,
                    fieldDefaults : {
                        labelAlign : 'top',
                        labelStyle : 'font-weight:bold',
                        inputValue : true,
                        uncheckedValue : false
                    },
                    items : [
                        {
                            layout : 'hbox',
                            items : [
                                {
                                    xtype : 'triggerfield',
                                    name : 'search',
                                    triggerCls : 'x-form-clear-trigger',
                                    allowBlank : false,
                                    width : 500,
                                    onTriggerClick : function ()
                                    {
                                        this.setRawValue('');
                                        me.store.clearFilter();
                                    },
                                    listeners : {
                                        specialkey : me.onGridSearchSpecialKey,
                                        scope : me
                                    }
                                },
                                {
                                    xtype : 'button',
                                    formBind : true,
                                    iconCls : 'icon-search',
                                    margin : '0 0 0 3px',
                                    handler : me.doSearch,
                                    scope : me
                                }
                            ]
                        },
                        {
                            xtype : 'checkboxgroup',
                            fieldLabel : 'Search in columns',
                            width : 500,
                            columns : 3,
                            items : [
                            ]
                        }
                    ]
                }
            ];

        // End.
        return menu;
    },
    /**
     * COMMENTME
     */
    createSearchFilter : function (filterQuery, fields)
    {
        var me = this,
            filter = [
        ];

        Ext.Object.each(fields, function (fieldName, active)
        {
            if (active) {
                filter.push({
                    property : fieldName,
                    value : filterQuery
                });
            }
            // End.
        }, me);

        // End.
        return filter;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @param {Ext.form.field.Trigger} searchField
     * @param {Ext.EventObject} e
     * @return 
     */
    onGridSearchSpecialKey : function (searchField, e)
    {
        var me = this;

        if (e.getKey() === e.ENTER) {
            me.doSearch();
        }
    },
    /**
     * COMMENTME
     */
    doSearch : function ()
    {
        var me = this,
            form = Ext.ComponentQuery.query('#grid-search-form')[0],
            store = me.store,
            values,
            filterQuery,
            filter;

        if (!form.isValid()) {
            // End, Form is not valid.
            return false;
        }

        values = form.getValues();
        filterQuery = values.search; //RegExp(values.search);
            delete values.search;
        filter = me.createSearchFilter(filterQuery, values);
        store.remoteFilter = true;

        store.clearFilter(true);
        store.filter(filter);
    }
});