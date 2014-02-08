describe('Test BM.App', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM).toBeDefined();
    });

    describe('BM.getApplication', function ()
    {
        it('should return the application instance', function ()
        {
            expect(typeof BM.getApplication).toBe('function');
        });
    });

    // Test all refs
});
