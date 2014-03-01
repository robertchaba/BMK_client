describe('Test BM.kernel.ns.Form', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.kernel.ns.Form');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.ns.Form).toBeDefined();
    });
});
