describe('Test User.controller.Index', function ()
{
    var indexController;

    beforeEach(function ()
    {
        Ext.syncRequire('User.controller.Index');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        indexController = BM.getApplication().getController('User.controller.Index');
    });

    afterEach(function ()
    {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(User.controller.Index).toBeDefined();
    });

    it('Class should be a ns controller.', function ()
    {
        expect(indexController.isNSController).toBeTruthy();
    });
});
