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
     * Add {@link Ext.grid.column.Column columns} to search on.
     * 
     * @property {Array} columns
     * @chainable
     */
    addSearchColumns : function (columns)
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
     * Return all searchable columns.
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
     * Return {@link Ext.menu.Menu menu} configuration to create a search menu.
     * 
     * @return {Array} Searchmenu configuration.
     */
    createSearchMenuConfig : function ()
    {
        var me = this;
        // End.
        return [
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
    },
    /**
     * Return {@link Ext.util.Filter filter} configuration to filter on.
     * 
     * @return {Array} Filter configuration.
     */
    createSearchFilterConfig : function (filterQuery, fields)
    {
        var me = this,
            filter = [];

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
        filter = me.createSearchFilterConfig(filterQuery, values);
        store.remoteFilter = true;

        store.clearFilter(true);
        store.filter(filter);
    }
});