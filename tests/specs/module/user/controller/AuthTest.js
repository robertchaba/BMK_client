describe('Test User.controller.Auth', function ()
{
    var authController;

    beforeEach(function ()
    {
        Ext.syncRequire('User.controller.Auth');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        authController = BM.getApplication().getController('User.controller.Auth');
    });

    afterEach(function ()
    {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(User.controller.Auth).toBeDefined();
    });

    it('Class should be a ns controller.', function ()
    {
        expect(authController.isNSController).toBeTruthy();
    });


    describe('onUnauthorized', function ()
    {
        // Mock a request exception
    });

    describe('onUnauthorizedResponse', function ()
    {
        beforeEach(function ()
        {
            authController.onUnauthorizedResponse();
        });

        afterEach(function ()
        {
            authController.getLoginWindow().destroy();
        });

        it('Should show a loginWindow.', function ()
        {
            var loginWindow = authController.getLoginWindow(),
                isVisible = loginWindow.isVisible();

            expect(isVisible).toBeTruthy();
        });

        it('Should focus the identity field.', function ()
        {
            var identityField = Ext.ComponentQuery.query('#userAuthLoginForm textfield[name=identity]')[0],
                activeField = Ext.get(document.activeElement);

            expect(identityField.inputEl.id).toEqual(activeField.id);
        });

        it('Should load a authentication shell', function ()
        {
            // Setup a HTTP request mock
        });
    });

    describe('onLogin', function ()
    {

    });

    describe('onLoginResponse', function ()
    {

    });

    describe('onLogout', function ()
    {

    });

    describe('onConfirmSessionDestroy', function ()
    {

    });
});
