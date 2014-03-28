/**
 * 
 */
Ext.define('BM.ux.grid.FilterHeader', {
    extend : 'Ext.AbstractPlugin',
    alias : 'plugin.filterheader',
    mixins : {
        observable : 'Ext.util.Observable'
    },
//	uses: [
//		'Ext.window.MessageBox',
//		'Ext.ux.form.field.ClearButton',
//		'Ext.ux.form.field.OperatorButton',
//		'Ext.container.Container',
//		'Ext.util.DelayedTask',
//		'Ext.layout.container.HBox',
//		'Ext.data.ArrayStore',
//		'Ext.button.Button',
//		'Ext.form.field.Text',
//		'Ext.form.field.Number',
//		'Ext.form.field.Date',
//		'Ext.form.field.ComboBox'
//	],
    /**
     * 
     */
    constructor : function () {
        var me = this;

        me.mixins.observable.constructor.call(me);
        me.callParent(arguments);
    },
    /**
     * 
     */
    init : function (grid)
    {
        var me = this;

        if (grid.rendered) {
            me.renderHeaderFilters();
        } else {
            grid.on('afterrender', me.renderHeaderFilters, me, {
                single : true
            });
        }
    },
    /**
     * @private
     * @param {BM.kernel.ns.Grid} grid 
     */
    renderHeaderFilters : function (grid)
    {
        var me = this;
        
        console.log(grid.headerCt.getGridColumns());

        Ext.Array.each(grid.headerCt.getGridColumns(), function (column) {
            console.log(column.id, column.getDesiredWidth( ), column.getWidth());
            var c = Ext.create('Ext.container.Container', {
                layout : 'hbox',
                items : [
                    {
                        xtype : 'textfield'
                    }
                ]
            });
            
            c.render(Ext.get(column.id));
        }, me);


//        Ext.Array.each(grid.columns, function (column) {
//            console.log('s');
//            
//            column.setDocked({
//                xtype : 'textfield'
//            }. true);
//            
//        }, me);

        // End.
        return true;
    }
});