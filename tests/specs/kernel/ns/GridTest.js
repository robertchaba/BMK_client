describe('Test BM.kernel.ns.Grid', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.kernel.ns.Grid');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.ns.Grid).toBeDefined();
    });
});
