describe('Test BM.kernel.ns.Model', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.kernel.ns.Model');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.ns.Model).toBeDefined();
    });
});
