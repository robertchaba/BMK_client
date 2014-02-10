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
        'BM-workspace-toolbar' : [
            {
                text : 'Close all tabs',
                handler : function (menuItem)
                {
                    var WSToolbarElement = new Ext.dom.Element(menuItem.parentMenu.contextmenuTarget).up('#BM-workspace-toolbar'),
                        WSToolbar = Ext.getCmp(WSToolbarElement.id),
                        WSTabbar = WSToolbar.down('tabbar'),
                        activeTab = WSTabbar.activeTab;
                    
                    while (activeTab) {
                        nextToClose = WSTabbar.findNextActivatable(activeTab);    
                        WSTabbar.closeTab(activeTab);
                        activeTab = nextToClose;
                    }
                    
                    // End.
                    return true;
                }
            }
        ],
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
        'gridview' : [
            {
                text : 'Search for this value', // Text
                handler : function (menuItem)
                {
                    var cellElement = new Ext.dom.Element(menuItem.parentMenu.contextmenuTarget),
                        searchValue = cellElement.getHTML().replace(/&(nbsp|amp|quot|lt|gt);/g, ''),
                        gridElement = cellElement.up('table'),
                        gridView,
                        grid,
                        toolbar,
                        searchButton,
                        searchField;

                    if (!gridElement || !searchValue) {
                        // End, No table element found.
                        Ext.Msg.alert('Error', 'No value found to search on.'); // TEXT
                        return false;
                    }

                    gridView = Ext.getCmp(cellElement.up('table').id.slice(0, -6));
                    grid = gridView.up('grid');

                    if (!grid.isNSGrid || !grid.toolbarCfg || !grid.toolbarCfg.search) {
                        // End. Grid is not searchable.
                        Ext.Msg.alert('Error', 'Grid is not searchable.'); // TEXT
                        return false;
                    }

                    toolbar = grid.getToolbar();
                    searchButton = toolbar.down('#grid-search');
                    searchField = searchButton.menu.down('[name=search]');
                    searchField.setValue(searchValue);
                    searchButton.showMenu();
                    toolbar.doSearch();

                    // End.
                    return true;
                }
            }
        ]
    }
});
