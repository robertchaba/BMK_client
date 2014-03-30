/**
 * 
 */
Ext.define('Application.controller.Index', {
    extend : 'BM.kernel.ns.Controller',
    
    id : 'applicationIndexController',
    
    refs : [
    ],
    
    stores : [
    ],
    
    models : [
    ],
    
    views : [
    ],
    
    contextmenus : {
        'BM-workspace-toolbar' : [
            {
                text : 'Close all tabs',
                handler : function (menuItem)
                {
                    var WSToolbarElement = new Ext.dom.Element(menuItem.parentMenu.contextmenuTarget).up('#BM-workspace-toolbar'),
                        WSToolbar = Ext.getCmp(WSToolbarElement.id),
                        WSTabbar = WSToolbar.down('tabbar'),
                        activeTab = WSTabbar.activeTab,
                        nextToClose;

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
        ]
    }
});
