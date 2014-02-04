Ext.Loader.setConfig({
    enable : true,
    paths : {
        // Application
        'BM' : 'app',
        // User
        'User' : 'app/module/user',
        // Admin
        'Admin' : 'app/module/admin'
    }
});

Ext.application('BM.App');