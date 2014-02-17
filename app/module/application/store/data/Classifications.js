Ext.define('Application.store.data.Classifications', {
    extend: 'BM.kernel.ns.Store',
    model : 'Model.application.Classification',
    proxy : {
        type : 'ajax',
        url : '/data/classification/id',
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