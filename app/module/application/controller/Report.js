/**
 * CLASS_COMMENT
 */
Ext.define('Application.controller.Report', {
    extend : 'BM.kernel.ns.Controller',
    /**
     * @inheritdoc
     */
    id : 'applicationReportController',
    /**
     * @inheritdoc
     */
    refs : [
        {
            ref : 'ReportForm',
            selector : '#applicationReportReportForm'
        },
        {
            ref : 'ReportWindow',
            selector : '#applicationReportReportWindow'
        },
        {
            ref : 'SubjectField',
            selector : '#applicationReportReportForm textfield[name=subject]'
        },
        {
            ref : 'ClassificationField',
            selector : '#applicationReportReportForm combobox[name=classificationsId]'
        },
        {
            ref : 'ReproducableField',
            selector : '#applicationReportReportWindow checkbox[name=reproducable]'
        },
        {
            ref : 'DescriptionField',
            selector : '#applicationReportReportWindow textareafield[name=descr]'
        },
        {
            ref : 'ExpectField',
            selector : '#applicationReportReportWindow textareafield[name=expected]'
        },
        {
            ref : 'ReproduceField',
            selector : '#applicationReportReportWindow textareafield[name=reproduce]'
        },
        {
            ref : 'WorkaroundField',
            selector : '#applicationReportReportWindow textareafield[name=workaround]'
        }
    ],
    /**
     * @inheritdoc
     */
    stores : [
        'Application.store.data.Classifications'
    ],
    /**
     * @inheritdoc
     */
    models : [
        'Application.model.Report'
    ],
    /**
     * @inheritdoc
     */
    views : [
        'Application.view.report.form.Report',
        'Application.view.report.window.Report'
    ],
    /**
     * @inheritdoc
     */
    listeners : {
    },
    /**
     * @inheritdoc
     */
    init : function (application)
    {
        var me = this;

        // Add listeners to components.
        me.control({
            '#BM-quickmenu-application-report-index' : {
                click : me.onDispatch
            },
            '#applicationReportReportForm combobox[name=classificationsId]' : {
                change : me.onClassificationChange
            },
            '#applicationReportReportForm checkbox[name=reproducable]' : {
                change : me.onReproducableChange
            },
            '#applicationReportReportForm button[action=cancel]' : {
                click : me.hideNSWindow
            },
            '#applicationReportReportForm button[action=report]' : {
                click : me.onReportSave
            }
        });
    },
    /**
     * @param {Number} [classificationsId]
     * @param {String} [subject]
     * @param {String} [descr]
     * @param {String} [reproduce]
     * @return {Boolean} Void.
     */
    report : function (classificationsId, subject, descr, reproduce)
    {
        var me = this,
            model = me.getNSModel('Report'),
            form = me.getNSForm('Report', {
                model : model,
                buttons : [
                    {
                        text : 'Cancel',
                        action : 'cancel'
                    },
                    {
                        text : 'Report',
                        action : 'report',
                        formBind : true
                    }
                ]
            });
        me.showNSWindow('Report', form);

        if (Ext.isString(subject)) {
            me.getSubjectField().setValue(subject);
        }

        if (Ext.isNumber(classificationsId)) {
            me.getClassificationField().setValue(classificationsId);
        }

        if (Ext.isString(descr)) {
            me.getDescriptionField().setValue(descr);
        }

        if (Ext.isString(reproduce)) {
            me.getReproduceField().setValue(reproduce);
        }

        // End.
        return true;
    },
    /**
     * @inheritdoc
     */
    onLaunch : function (application)
    {
    },
    /**
     * This method is called after the module portal controller onLaunch
     * method is executed.
     *
     * @private
     * @param{BM.view.portal.Panel} portal
     * @return {Boolean} Void.
     */
    onPortal : function (portal)
    {
        portal.addPortlet();
    },
    /**
     * @inheritdoc
     */
    onDispatch : function ()
    {
        var me = this;
        me.report(1); // Feedback
        // End.
        return true;
    },
    onReportSave : function ()
    {
        var me = this,
            form = me.getReportForm();

        if (form.isValid()) {
            form.saveModel({
                loadMaskMsg : 'Reporting...', // TEXT
                scope : me,
                callback : me.onReportSaveResponse
            });
        }

        // End.
        return true;
    },
    onReportSaveResponse : function (report, operation, success)
    {
        var me = this,
            window = me.getReportWindow();

        if (success && window) {
            window.close();
        }

        Ext.Msg.alert('Thanks', 'Thank, we appreciate your feedback. Please don\'t be shy to report some more feedback.'); // TEXT

        // End.
    },
    onClassificationChange : function (combo, newValue)
    {
        var me = this,
            expectField = me.getExpectField(),
            reproduceField = me.getReproduceField(),
            workaroundField = me.getWorkaroundField(),
            reproducableField = me.getReproducableField();

        expectField.hide();
        reproduceField.hide();
        workaroundField.hide();
        reproducableField.hide();

        switch (newValue) {
            case 1:
            case 2:
                reproducableField.setValue(false);
                break;
            case 3:
                reproducableField.show();
                expectField.show();
                reproducableField.setValue(false);
                break;
            default:
                expectField.show();
                reproduceField.show();
                workaroundField.show();
                reproducableField.show();
        }

        // End.
        return true;
    },
    onReproducableChange : function (checkbox, checked)
    {
        var me = this,
            classificationField = me.getClassificationField(),
            reproduceField = me.getReproduceField();

        if (checked) {
            reproduceField.show();
        } else if (classificationField.getValue() <= 3) {
            reproduceField.hide();
        }

        // End.
        return true;
    }
});