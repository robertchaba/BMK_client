Ext.Loader.setConfig({
    enable : true,
    paths : {
        BM : 'app',
        Model : 'app/model',
        Application : 'app/module/application',
        User : 'app/module/user',
        Admin : 'app/module/admin',
        File : 'app/module/file'
    }
});

Ext.application({
    extend : 'BM.App',
    name : 'BM',
    controllers : [
        'Application.controller.Index',
        'Application.controller.Report',
        'User.controller.Index',
        'User.controller.Auth',
        'Admin.controller.Index',
        'Admin.controller.Resources',
        'Admin.controller.Roles',
        'Admin.controller.Users',
        'Admin.controller.Permissions',
        'File.controller.Index',
        'File.controller.Manager'
    ]
});
