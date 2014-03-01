describe('Test User.controller.Auth', function () {

    beforeEach(function () {
        Ext.syncRequire('User.controller.Auth');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(User.controller.Auth).toBeDefined();
    });
});
