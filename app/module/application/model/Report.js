/**
 * 
 */
Ext.define('Application.model.Report', {
    extend : 'Model.application.Report',
    proxy : {
        type : 'ajax',
        api : {
            create : '/report'
        },
        reader : {
            type : 'json',
            root : 'report',
            messageProperty : 'message'
        },
        writer : {
            type : 'json',
            root : 'report',
            encode : true
        }
    }
});