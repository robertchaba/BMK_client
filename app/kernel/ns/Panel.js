/**
 * Abstract NS panel which defines panel helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Panel', {
    extend : 'Ext.panel.Panel',
    /**
     * @property {Boolean} isNSPanel true to identify this class as namespace panel.
     */
    isNSPanel : true,
    id : 'nsPanel',
    iconCls : 'icon-bug',
    title : 'NS panel title',
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