Ext.define('Application.controller.Index', {
    extend : 'BM.kernel.ns.Controller',
    /**
     * @inheritdoc
     */
    id : 'applicationIndexController',
    /**
     * @inheritdoc
     */
    refs : [
    ],
    /**
     * @inheritdoc
     */
    stores : [
    ],
    /**
     * @inheritdoc
     */
    models : [
    ],
    /**
     * @inheritdoc
     */
    views : [
    ],
    /**
     * @inheritdoc
     */
    contextmenus : {
        'combobox' : [
            {
                text : 'Reload list', // Text
                handler : function (menuItem)
                {
                    var comboId = menuItem.parentMenu.contextmenuTarget.id.slice(0, -8),
                        combobox = Ext.getCmp(comboId);
                    combobox.getStore().reload();

                    // End.
                    return true;
                }
            }
        ],
        'grid' : [
            {
                text : 'Search for this value', // Text
                handler : function (menuItem)
                {
                    var cellElement = new Ext.dom.Element(menuItem.parentMenu.contextmenuTarget),
                        searchValue = cellElement.getHTML(),
                        gridView = Ext.getCmp(cellElement.up('table').id.slice(0, -6)),
                        grid = gridView.up('grid'),
                        toolbar,gridSearch,
                        searchMenu, searchField
                        gridFilter;

                    if (!grid || !grid.isNSGrid) {
                        // End, Grid not found or is not a NSGrid.
                        return false;
                    }

                    if (!grid.toolbarCfg || !grid.toolbarCfg.search) {
                        // End. Grid is not searchable.
                        Ext.Msg.alert('Grid is not searchable');
                        return false;
                    }
                    
                    toolbar = grid.getToolbar();
                    
                    gridSearch = toolbar.down('#grid-search');
                    searchMenu = gridSearch.menu;
                    searchField = searchMenu
                    
                    
                    console.log(searchMenu);
                    
                    
//                    filterMenu.show();
//                    
//                    gridFilter = toolbar.mixins.gridFilter;
//                    gridFilter.setSearchValue(searchValue);
//                    gridFilter.doSearch();

                    // End.
                    return true;
                }
            }
        ]
    },
    /**
     * @inheritdoc
     */
    listeners : {
    },
    /**
     * @inheritdoc
     */
    init : function (application)
    {
        var me = this;

        // Add listeners to components.
        this.control({});
    },
    /**
     * @inheritdoc
     */
    onLaunch : function (application)
    {
    },
    /**
     * @inheritdoc
     */
    onPortal : function (portal)
    {
    },
    /**
     * @inheritdoc
     */
    onDispatch : function ()
    {
    },
    /**
     * @private
     */
    getAppContextmenus : function ()
    {
        var me = this,
            contextmenuConfig = {
                'BM-navigation' : [
                    {
                        text : 'Header contextmenu item',
                        handler : function (item, e)
                        {
                            // Action code
                        }
                    },
                    {
                        text : 'Bla',
                        handler : function ()
                        {
                        }
                    }
                ]
            };

        // End.
        return contextmenuConfig;
    }
});
