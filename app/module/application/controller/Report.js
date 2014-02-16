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
        }
    ],
    /**
     * @inheritdoc
     */
    stores : [
//        'Application.store.Report'
    ],
    /**
     * @inheritdoc
     */
    models : [
//        'Application.model.Report'
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
            }
        });
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
        var me = this,
//            model = me.getNSModel('Report'),
            form = me.getNSForm('Report', true);

        me.showNSWindow('Report', form);

        // End.
        return true;
    }
});