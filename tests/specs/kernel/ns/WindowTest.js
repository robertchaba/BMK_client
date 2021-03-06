describe('Test BM.kernel.ns.Window', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.kernel.ns.Window');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.ns.Window).toBeDefined();
    });
});
