/**
 * The application viewable area.  
 * All regions (North, East, South, West and Center) are registered and can be 
 * used to render view to. In the {@Link BM.App application}, references to all 
 * viewport regions are registereds.  
 * Use:  
 * `getNorthRegion()`, `getEastRegion()`, `getSouthRegion()`, `getWestRegion()`,
 * `getCenterRegion()`.
 * 
 * See {@link Ext.container.Viewport}.
 */
Ext.define('BM.view.Viewport', {
    extend : 'Ext.Viewport',
    requires : [
        'Ext.layout.container.Border'
    ],
    autoDestroy : true,
    autoScroll : false,
    autoShow : false,
    border : false,
    bubbleEvents : [
    ],
    defaultType : 'panel',
    defaults : {
        border : false
    },
    items : [
        {
            region : 'north'
        },
        {
            region : 'east'
        },
        {
            region : 'south'
        },
        {
            region : 'west'
        },
        {
            region : 'center',
            layout: 'fit'
        }
    ],
    layout : 'border'
});