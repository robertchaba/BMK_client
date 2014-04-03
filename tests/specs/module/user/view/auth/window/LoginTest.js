describe('Test User.view.auth.window.Login', function ()
{
    var loginWindow;

    beforeEach(function ()
    {
        Ext.syncRequire('User.view.auth.window.Login');

        loginWindow = Ext.create('User.view.auth.window.Login');
    });

    afterEach(function ()
    {
        loginWindow.destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(User.view.auth.window.Login).toBeDefined();
    });

    it('Class should be a ns window.', function ()
    {
        expect(loginWindow.isNSWindow).toBeTruthy();
    });
});
