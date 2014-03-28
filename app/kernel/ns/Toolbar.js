/**
 * Abstract NS toolbar which defines toolbar helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Toolbar', {
    extend : 'Ext.toolbar.Toolbar',
    requires : [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Number'
    ],
    mixins : {
        bindable : 'Ext.util.Bindable'
    },
    /**
     * @cfg {Boolean} paging
     * Adds a {Ext.toolbar.Paging pagingtoolbar} to the right to the toolbar.
     */

// TODO Remove me, filter replacement.
//    /**
//     * @cfg {Boolean} search
//     * When true {@link BM.ux.grid.FilterTool} will be initialized and a search
//     * filter button added to the toolbar.
//     */

    /**
     * @cfg {Boolean|String} allowedButtons
     * False to not add allowed buttons.
     * String (Controllername) to add allowed buttons from an other controller.
     */

    /**
     * @cfg {Boolean} beforeAllowed
     * True to add the defined items before the allowed buttons.
     */

    /**
     * @property {Ext.data.Store} store
     * The {@link Ext.data.Store} the paging toolbar should use as its data source.
     */

    /**
     * @cfg {Boolean} displayInfo
     * true to display the displayMsg
     */
    displayInfo : false,
    /**
     * @cfg {Boolean} prependButtons
     * true to insert any configured items _before_ the paging buttons.
     */
    prependButtons : true,
    /**
     * 
     */
    lastButton : true,
    /**
     * @cfg {String} displayMsg
     * The paging status message to display. Note that this string is
     * formatted using the braced numbers {0}-{2} as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
    displayMsg : 'Displaying {0} - {1} of {2}',
    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found.
     */
    emptyMsg : 'No data to display',
    /**
     * @cfg {String} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     * {0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    afterPageText : 'of {0}',
    /**
     * @cfg {Number} inputItemWidth
     * The width in pixels of the input field used to display and change the current page number.
     */
    inputItemWidth : 30,
    /**
     * @property {Boolean} isNSToolbar true to identify this class as namespace toolbar.
     */
    isNSToolbar : true,
    /**
     * 
     */
    initComponent : function ()
    {
        var me = this;

        if (me.paging && me.store) {
            me.initPaging();
        }

// TODO Remove me, filter replacement.
//        if (me.search) {
//            if (Ext.Array.contains(me.items, '->')) {
//                me.items.push('-');
//            } else {
//                me.items.push('->');
//            }
//
//            me.items.push({
//                itemId : 'grid-search',
//                iconCls : 'icon-search',
//                menu : me.createSearchMenuConfig()
//            });
//        }

        me.callParent();

        me.addEvents(
            /**
             * @event change
             * Fires after the active page has been changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Object} pageData An object that has these properties:
             *
             * - `total` : Number
             *
             *   The total number of records in the dataset as returned by the server
             *
             * - `currentPage` : Number
             *
             *   The current page number
             *
             * - `pageCount` : Number
             *
             *   The total number of pages (calculated from the total number of records in the dataset as returned by the
             *   server and the current {@link Ext.data.Store#pageSize pageSize})
             *
             * - `toRecord` : Number
             *
             *   The starting record index for the current page
             *
             * - `fromRecord` : Number
             *
             *   The ending record index for the current page
             */
            'change',
            /**
             * @event beforechange
             * Fires just before the active page is changed. Return false to prevent the active page from being changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Number} page The page number that will be loaded on change
             */
            'beforechange'
            );
//
        me.on('beforerender', me.onLoad, me, {
            single : true
        });
//
        me.bindStore(me.store || 'ext-empty-store', true);

        // End.
        return true;
    },
    /**
     * Disable toolbar items.  
     * Toolbar items can depend on user actions like a grid row selection,
     * {@link #disableItems} can be used to disable items until the required 
     * action is executed.
     * 
     * @param {Array} items Array of toolbar item id's
     * @return {Boolean} Void.
     */
    disableItems : function (items)
    {
        var me = this;

        Ext.Array.each(items, function (itemId)
        {
            var item = me.down(itemId);

            if (!item || !item.isComponent) {
                // End, item not found or is not a component.
                return;
            }

            item.disable();
            // End.
        }, me);

        // End.
        return true;
    },
    /**
     * Add listeners to toolbar items to enable/ disable the items on grid row
     * selected/ deselection.
     * 
     * @param {Array} items Array of toolbar item id's.
     * @param {Ext.grid.Panel} grid
     * @return {Boolean} Void.
     */
    toggleItemsOnSelectionchnage : function (items, grid)
    {
        if (!grid || !grid.isNSGrid) {
            // End, No grid given.
            return false;
        }

        var me = this;

        Ext.Array.each(items, function (itemId)
        {
            var item = me.down(itemId);

            if (!item || !item.isComponent) {
                // End, item not found or is not a component.
                return;
            }

            grid.on('selectionchange', function (selectionModel)
            {
                if (selectionModel.getCount() > 0) {
                    item.enable();
                } else {
                    item.disable();
                }
                // End.
            });
            // End.
        }, me);

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @return {Boolean} Void.
     */
    initPaging : function ()
    {
        var me = this,
            pagingItems = me.getPagingItems(),
            userItems = me.items || me.buttons || [];

        if (me.prependButtons) {
            userItems.push('->');
            me.items = userItems.concat(pagingItems);
        } else {
            pagingItems.push('->');
            me.items = pagingItems.concat(userItems);
        }

        delete me.buttons;

        if (me.displayInfo) {
            me.items.push(
                {
                    xtype : 'tbtext',
                    itemId : 'displayItem'
                }
            );
        }

        // End.
        return true;
    },
    /**
     * Gets the standard paging items in the toolbar.
     * 
     * @private
     * @return {Array} Paging items.
     */
    getPagingItems : function ()
    {
        var me = this,
            items = [
                {
                    itemId : 'prev',
                    iconCls : 'icon-chevron-left',
                    disabled : true,
                    handler : me.movePrevious,
                    scope : me
                },
                '-',
                {
                    xtype : 'numberfield',
                    itemId : 'inputItem',
                    name : 'inputItem',
                    cls : Ext.baseCSSPrefix + 'tbar-page-number',
                    allowDecimals : false,
                    minValue : 1,
                    hideTrigger : true,
                    enableKeyEvents : true,
                    keyNavEnabled : false,
                    selectOnFocus : true,
                    submitValue : false,
                    // mark it as not a field so the form will not catch it when getting fields
                    isFormField : false,
                    width : me.inputItemWidth,
                    margins : '-1 2 3 2',
                    listeners : {
                        scope : me,
                        keydown : me.onPagingKeyDown,
                        blur : me.onPagingBlur
                    }
                },
                {
                    xtype : 'tbtext',
                    itemId : 'afterTextItem',
                    text : Ext.String.format(me.afterPageText, 1)
                },
                '-',
                {
                    itemId : 'next',
                    iconCls : 'icon-chevron-right',
                    disabled : true,
                    handler : me.moveNext,
                    scope : me
                },
                '-',
                {
                    itemId : 'refresh',
                    iconCls : 'icon-refresh',
                    handler : me.doRefresh,
                    scope : me
                }
            ];

        // End.
        return items;
    },
    /**
     * Move to the previous page, has the same effect as clicking the 'previous' button.
     * 
     * @return {Boolean} Void.
     */
    movePrevious : function ()
    {
        var me = this,
            prev = me.store.currentPage - 1;

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
                me.store.previousPage();
            }
        }

        // End.
        return true;
    },
    /**
     * Move to the next page, has the same effect as clicking the 'next' button.
     * 
     * @return {Boolean} Void.
     */
    moveNext : function ()
    {
        var me = this,
            total = me.getPageData().pageCount,
            next = me.store.currentPage + 1;

        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
                me.store.nextPage();
            }
        }

        // End.
        return true;
    },
    /**
     * Refresh the current page, has the same effect as clicking the 'refresh' button.
     * 
     * @return {Boolean} Void.
     */
    doRefresh : function ()
    {
        var me = this,
            current = me.store.currentPage,
            store = me.store;

        store.clearFilter(true);

        if (me.fireEvent('beforechange', me, current) !== false) {
            me.store.loadPage(current);
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    updateInfo : function ()
    {
        var me = this,
            displayItem = me.child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count,
            msg;

        if (displayItem) {
            count = store.getCount();
            if (count === 0) {
                msg = me.emptyMsg;
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                    );
            }

            displayItem.setText(msg);
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    onLoad : function ()
    {
        var me = this,
            count = me.store.getCount(),
            isEmpty = (count === 0),
            pageData,
            currPage,
            pageCount,
            afterText,
            item;

        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;
            afterText = Ext.String.format(
                me.afterPageText,
                isNaN(pageCount) ? 1 : pageCount
                );
        } else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(me.afterPageText, 0);
        }

        Ext.suspendLayouts();

        item = me.child('#afterTextItem');
        if (item) {
            item.setText(afterText);
        }

        item = me.getInputItem();
        if (item) {
            item.setDisabled(isEmpty).setValue(currPage);
        }

        me.setChildDisabled('#first', (currPage === 1) || isEmpty);
        me.setChildDisabled('#prev', (currPage === 1) || isEmpty);
        me.setChildDisabled('#next', (currPage === pageCount) || isEmpty);
        me.setChildDisabled('#last', (currPage === pageCount) || isEmpty);
        me.setChildDisabled('#refresh', false);
        me.updateInfo();

        Ext.resumeLayouts(true);

        if (me.rendered) {
            me.fireEvent('change', me, pageData);
        }

        // End.
        return true;
    },
    /**
     * @private
     * @param {type} selector
     * @param {type} disabled 
     * @return {Boolean} Void.
     */
    setChildDisabled : function (selector, disabled)
    {
        var me = this,
            item = me.child(selector);
        if (item) {
            item.setDisabled(disabled);
        }

        // End.
        return true;
    },
    /**
     * Get count information and the currentpage store.
     * 
     * @private
     * @return {Object} page data.
     */
    getPageData : function ()
    {
        var me = this,
            store = me.store,
            totalCount = store.getTotalCount();

        // End.
        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount : Math.ceil(totalCount / store.pageSize),
            fromRecord : ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord : Math.min(store.currentPage * store.pageSize, totalCount)

        };
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    onLoadError : function ()
    {
        var me = this;
        if (!me.rendered) {
            return;
        }
        me.setChildDisabled('#refresh', false);

        // End.
        return true;
    },
    /**
     * Return {@link Ext.form.field.Number} field.
     * 
     * @private
     * @return {Ext.form.field.Number}
     */
    getInputItem : function ()
    {
        var me = this;
        // End.
        return me.child('#inputItem');
    },
    /**
     * Return the page number from the input item.
     * 
     * @private
     * @param {Object} pageData 
     * @return {Number|Boolean} Page number if filled in, false otherwise.
     */
    readPageFromInput : function (pageData)
    {
        var me = this,
            inputItem = me.getInputItem(),
            pageNum = false,
            v;

        if (inputItem) {
            v = inputItem.getValue();

            pageNum = parseInt(v, 10);
            if (!v || isNaN(pageNum)) {
                inputItem.setValue(pageData.currentPage);
                // End.
                return false;
            }
        }

        // End.
        return pageNum;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    onPagingFocus : function ()
    {
        var me = this,
            inputItem = me.getInputItem();

        if (inputItem) {
            inputItem.select();
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    onPagingBlur : function ()
    {
        var me = this,
            inputItem = me.getInputItem(),
            curPage;

        if (inputItem) {
            curPage = me.getPageData().currentPage;
            inputItem.setValue(curPage);
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @param {type} field
     * @param {type} e
     * @return {Boolean} Void.
     */
    onPagingKeyDown : function (field, e)
    {
        var me = this,
            k = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (k === e.RETURN) {
            e.stopEvent();

            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);

                if (me.fireEvent('beforechange', me, pageNum) !== false) {
                    me.store.loadPage(pageNum);
                }
            }
        } else if ((k === e.HOME) || (k === e.END)) {
            e.stopEvent();

            pageNum = (k === e.HOME) ? 1 : pageData.pageCount;

            field.setValue(pageNum);
        } else if ((k === e.UP) || (k === e.PAGE_UP) || (k === e.DOWN) || (k === e.PAGE_DOWN)) {
            e.stopEvent();

            pageNum = me.readPageFromInput(pageData);
            if (pageNum) {
                if ((k === e.DOWN) || (k === e.PAGE_DOWN)) {
                    increment *= -1;
                }

                pageNum += increment;
                if ((pageNum >= 1) && (pageNum <= pageData.pageCount)) {
                    field.setValue(pageNum);
                }
            }
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    beforeLoad : function ()
    {
        var me = this;

        if (me.rendered) {
            me.setChildDisabled('#refresh', true);
        }

        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Object} Object with store listeners.
     */
    getStoreListeners : function ()
    {
        var me = this;
        // End.
        return {
            beforeload : me.beforeLoad,
            load : me.onLoad,
            exception : me.onLoadError
        };
    },
    /**
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store}.
     * 
     * @deprecated
     * @return {Boolean} Void.
     */
    unbind : function ()
    {
        var me = this;
        me.bindStore(null);
        // End.
        return true;
    },
    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store}.
     * 
     * @deprecated
     * @param {Ext.data.Store} store The data store to bind
     * @return {Boolean} Void.
     */
    bind : function (store)
    {
        var me = this;
        me.bindStore(store);
        // End.
        return true;
    },
    /**
     * COMMENTME
     * 
     * @private
     * @return {Boolean} Void.
     */
    onDestroy : function ()
    {
        var me = this;
        me.unbind();
        me.callParent();
        // End.
        return true;
    }
});
