describe('Test BM.App', function () {

    beforeEach(function () {
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');
    });

    afterEach(function () {
//        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM).toBeDefined();
    });

    describe('BM.getApplication', function ()
    {
        it('should return the application instance', function ()
        {
            expect(typeof BM.App).toBe('function');
        });
    });

    describe('#init', function ()
    {
        // Test if all init methods are called
    });

    describe('#launch', function ()
    {
        // Test if the bootstrap structure is called
    });

    // Test all refs
});
