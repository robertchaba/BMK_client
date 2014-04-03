describe('Test User.model.User', function ()
{
    var userModel;

    beforeEach(function ()
    {
        Ext.syncRequire('User.model.User');

        userModel = Ext.create('User.model.User');
    });
    
    afterEach(function ()
    {
        userModel = undefined;
    });

    it('Class should be loaded', function ()
    {
        expect(User.model.User).toBeDefined();
    });
    
    it('Class should be a ns model.', function ()
    {
        expect(userModel.isNSModel).toBeTruthy();
    });
});
