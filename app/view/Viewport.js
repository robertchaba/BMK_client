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
    /**
     * @inheritdoc
     * @readonly
     */
    autoDestroy : true,
    /**
     * @inheritdoc
     * @readonly
     */
    autoScroll : false,
    /**
     * @inheritdoc
     * @readonly
     */
    autoShow : false,
    /**
     * @inheritdoc
     * @readonly
     */
    border : false,
    /**
     * @inheritdoc
     * @readonly
     */
    bubbleEvents : [
    ],
    /**
     * @inheritdoc
     * @readonly
     */
    defaultType : 'panel',
    /**
     * @inheritdoc
     * @readonly
     */
    defaults : {
        border : false
    },
    /**
     * @inheritdoc
     * @readonly
     */
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
    /**
     * @inheritdoc
     * @readonly
     */
    layout : 'border'
});