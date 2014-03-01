describe('Test BM.ux.grid.FilterTool', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.ux.grid.FilterTool');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.ux.grid.FilterTool).toBeDefined();
    });
});
