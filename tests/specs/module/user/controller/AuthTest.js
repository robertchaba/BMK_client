describe('Test User.controller.Auth', function ()
{
    var authController;

    beforeEach(function ()
    {
        Ext.syncRequire('User.controller.Auth');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        jasmine.Ajax.install();

        authController = BM.getApplication().getController('User.controller.Auth');
    });

    afterEach(function ()
    {
        Ext.ComponentQuery.query('viewport')[0].destroy();

        jasmine.Ajax.uninstall();
    });

    it('Class should be loaded', function ()
    {
        expect(User.controller.Auth).toBeDefined();
    });

    it('Class should be a ns controller.', function ()
    {
        expect(authController.isNSController).toBeTruthy();
    });

    describe('init', function ()
    {
        beforeEach(function ()
        {

        });

        // Do a request.
        // Return with an exception
        // See if onUnauthorized is called

        // Fake click and enter events on the controlled components.
        // See if the right actions are called.
    });

    describe('onUnauthorized', function ()
    {
        var request,
            response;

        beforeEach(function ()
        {
            spyOn(authController, 'onUnauthorizedResponse');

            // Do the request.
            Ext.Ajax.request({
                url : '/user/profile',
                callback : function (opt, success, res)
                {
                    response = res;
                }
            });

            // Respond.
            request = jasmine.Ajax.requests.mostRecent();

        });

        afterEach(function ()
        {
            var loginWindow = authController.getLoginWindow();
            if (loginWindow) {
                loginWindow.destroy();
            }

            request = response = undefined;
        });

        it('Should return early if there is no response', function ()
        {
            var result = authController.onUnauthorized(); // No connection or response.

            expect(result).toBeFalsy();
        });

        it('Should return early if the response status code not equals 401', function ()
        {
            request.response({
                status : 402 // We dont want payments, :)
            });

            var result = authController.onUnauthorized(null, response);

            expect(result).toBeFalsy();
        });

        it('Should call onUnauthorizedResponse', function ()
        {
            request.response({
                status : 401
            });

            expect(authController.onUnauthorizedResponse).toHaveBeenCalled();
        });
    });

    describe('onUnauthorizedResponse', function ()
    {
        var request;

        beforeEach(function ()
        {
            authController.onUnauthorizedResponse();
        });

        afterEach(function ()
        {
            authController.getLoginWindow().destroy();

            request = undefined;
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
            var url,
                urlPath;

            request = jasmine.Ajax.requests.mostRecent();
            url = request.url;
            urlPath = url.substr(0, url.indexOf('?'));

            expect(urlPath).toBe('/user/auth/login');
        });
    });

    describe('onLogin', function ()
    {
        it('Should not send the login request if the form is invalid', function ()
        {
        });

        it('Should not send a login request if another login request is active', function ()
        {
        });

        it('Should set isAuthenticating to true', function ()
        {
        });

        it('Should send a login request', function ()
        {
        });
    });

    describe('onLoginResponse', function ()
    {
        it('Should set isAuthenticating to false', function ()
        {
        });

        it('Should show a alert if the login attempt fail', function ()
        {
            // also test if the method early return.
        });

        it('Should close the login window', function ()
        {
        });

        it('Should call loadProfile', function ()
        {
        });
    });

    describe('onLogout', function ()
    {
        it('Should show a confirm message', function ()
        {
        });
    });

    describe('onConfirmSessionDestroy', function ()
    {
        it('Should not send a logout request if the logout is not confirmed', function ()
        {
        });

        it('Should send a logout request if the logout is confirmed', function ()
        {
        });
    });
});
