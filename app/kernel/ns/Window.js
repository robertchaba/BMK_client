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
    /**
     * @inheritdoc
     */
    id : 'nsWindow',
    /**
     * @inheritdoc
     */
    iconCls : 'icon-bug',
    /**
     * @inheritdoc
     */
    title : 'NS window title',
    /**
     * @inheritdoc
     */
    animateTarget : '',
    /**
     * @inheritdoc
     */
    shrinkWrap : 3,
    /**
     * @inheritdoc
     */
    constrain : true,
    /**
     * @inheritdoc
     */
    modal : true,
    /**
     * @inheritdoc
     */
    resizable : false,
    /**
     * @inheritdoc
     */
    initComponent : function ()
    {
        var me = this;

        me.callParent();

        // End.
        return true;
    }
});