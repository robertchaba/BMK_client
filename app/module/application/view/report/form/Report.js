/**
 * 
 */
Ext.define('Application.view.report.form.Report', {
    extend : 'BM.kernel.ns.Form',
    requires : [
    ],
    id : 'applicationReportReportForm',
    iconCls : 'icon-bullhorn',
    title : 'Feedback',
    initComponent : function ()
    {
        var me = this;

        Ext.apply(me, {
            width : 520, //((3 * 245) + (2 * 10)) + (2 * 5),
            items : [
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textfield',
                            name : 'subject',
                            fieldLabel : 'Subject',
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'combobox',
                            store : 'Application.store.data.Classifications',
                            name : 'classificationsId',
                            displayField : 'name',
                            valueField : 'id',
                            fieldLabel : 'Classification',
                            editable : false,
                            queryMode : 'local',
                            listeners : {
                                render : function(combo)
                                {
                                    combo.store.load();
                                }
                            }
                        },
                        {
                            layout : 'vbox',
                            items : [
                                {
                                    xtype : 'checkbox',
                                    name : 'reportback',
                                    boxLabel : 'Keep me informed'
                                },
                                {
                                    xtype : 'checkbox',
                                    name : 'reproducable',
                                    boxLabel : 'Reproducable',
                                    hidden : true
                                }
                            ]
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : 'descr',
                            fieldLabel : 'Description / Feedback',
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : 'expected',
                            fieldLabel : 'What did you expect?',
                            hidden : true,
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : 'reproduce',
                            fieldLabel : 'How to reproduce?',
                            hidden : true,
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : 'workaround',
                            fieldLabel : 'Do you know a workaround?',
                            hidden : true,
                            width : 500
                        }
                    ]
                }
            ]
        });

        me.callParent();

        // End.
        return true;
    }
});