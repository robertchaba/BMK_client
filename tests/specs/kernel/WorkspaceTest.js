describe('Test BM.kernel.Workspace', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.Workspace).toBeDefined();
    });
});
