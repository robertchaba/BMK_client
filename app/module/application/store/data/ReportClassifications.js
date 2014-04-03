Ext.define('Application.store.data.ReportClassifications', {
    extend: 'BM.kernel.ns.Store',
    model : 'Model.application.ReportClassification',
    remoteFilter : false,
    proxy : {
        type : 'ajax',
        url : '/data/report-classification/id',
        reader : {
            type : 'json',
            root : 'data',
            messageProperty : 'message'
        },
        writer : {
            type : 'json',
            root : 'data',
            encode : true
        }
    }
});