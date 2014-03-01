describe('Test BM.kernel.ns.Controller', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.kernel.ns.Controller');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.ns.Controller).toBeDefined();
    });
});
