describe('Test User.view.auth.form.Login', function ()
{
    var loginForm;

    beforeEach(function ()
    {
        Ext.syncRequire('User.view.auth.form.Login');

        loginForm = Ext.create('User.view.auth.form.Login');
    });

    afterEach(function ()
    {
        loginForm.destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(User.view.auth.form.Login).toBeDefined();
    });

    it('Class should be a ns Form.', function ()
    {
        expect(loginForm.isNSForm).toBeTruthy();
    });
});
