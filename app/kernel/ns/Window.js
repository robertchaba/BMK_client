/**
 * Abstract NS window which defines window helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Window', {
    extend : 'Ext.window.Window',
    /**
     * @property {Boolean} isNSWindow true to identify this class as namespace window.
     */
    isNSWindow : true,
    id : 'nsWindow',
    iconCls : 'icon-bug',
    title : 'NS window title',
    animateTarget : '',
    shrinkWrap : 3,
    constrain : true,
    modal : true,
    resizable : false,
    /**
     * @inheritdoc
     */
    initComponent : function ()
    {
        var me = this;
        
        me.bodyStyle = {
            background : '#dfeaf2'
        };

        me.callParent();

        // End.
        return true;
    }
});