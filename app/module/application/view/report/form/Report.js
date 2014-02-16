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
                            name : '',
                            fieldLabel : 'Classification'
                        },
                        {
                            xtype : 'datefield',
                            name : '',
                            fieldLabel : 'Date'
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            layout : 'vbox',
                            items : [
                                {
                                    xtype : 'checkbox',
                                    name : '',
                                    boxLabel : 'Keep me informed'
                                },
                                {
                                    xtype : 'checkbox',
                                    name : '',
                                    boxLabel : 'Reproducable'
                                }
                            ]
                        },
                        {
                            layout : 'vbox',
                            items : [
                                {
                                    xtype : 'textfield',
                                    name : '',
                                    fieldLabel : 'Reported by'
                                },
                                {
                                    xtype : 'combobox',
                                    name : '',
                                    fieldLabel : 'OS'
                                },
                                {
                                    xtype : 'combobox',
                                    name : '',
                                    fieldLabel : 'Browser'
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
                            name : '',
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
                            name : '',
                            fieldLabel : 'What did you expect?',
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : '',
                            fieldLabel : 'How to reproduce?',
                            width : 500
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'textareafield',
                            name : '',
                            fieldLabel : 'Do you know a workaround?',
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