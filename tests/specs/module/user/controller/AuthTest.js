describe('Test User.controller.Auth', function ()
{
    var authController;

    beforeEach(function ()
    {
        Ext.syncRequire('User.controller.Auth');
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        // Mock ajax calls.
        jasmine.Ajax.install();

        // 
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

    it('Controller should create references methods', function ()
    {
        expect(typeof authController.getLoginForm).toBe('function');
        expect(typeof authController.getLoginWindow).toBe('function');
    });

    describe('init', function ()
    {
        var initResult;

        beforeEach(function () {
            spyOn(Ext.Ajax, 'on');
            spyOn(authController, 'control');

            initResult = authController.init();
        });

        it('Should add a AJAX request exception listener', function ()
        {
            expect(Ext.Ajax.on).toHaveBeenCalledWith('requestexception', authController.onUnauthorized, authController);
        });

        it('Should add event listeners to used components', function ()
        {
            var componentControls = {
                '#BM-quickmenu-user-auth-logout' : {
                    click : authController.onLogout
                },
                '#userAuthLoginForm' : {
                    enter : authController.onLogin
                },
                '#userAuthLoginForm button[name=login]' : {
                    click : authController.onLogin
                }
            };

            expect(authController.control).toHaveBeenCalledWith(componentControls);
        });

        it('Should be chainable', function ()
        {
            expect(initResult).toBe(authController);
        });
    });

    describe('onUnauthorized', function ()
    {
        var response;

        beforeEach(function ()
        {
            spyOn(authController, 'onUnauthorizedResponse');
        });

        afterEach(function ()
        {
            response = undefined;
        });

        it('Should return early if there is no response or the response status code not equals 401', function ()
        {
            var result;

            result = authController.onUnauthorized(); // No connection or response.

            expect(result).toBeFalsy();

            result = undefined;
            result = authController.onUnauthorized('unused', {
                status : 402
            });

            expect(result).toBeFalsy();
        });

        it('Should call onUnauthorizedResponse if the response status code equals 401', function ()
        {
            authController.onUnauthorized('unused', {
                status : 401
            });

            expect(authController.onUnauthorizedResponse).toHaveBeenCalled();
        });
    });

    describe('onUnauthorizedResponse', function ()
    {
        var nsForm;

        beforeEach(function ()
        {
            nsForm = BM.kernel.ns.Form.prototype;

            spyOn(authController, 'showNSWindow');

            spyOn(nsForm, 'focusField');
            spyOn(nsForm, 'loadModel');

            authController.onUnauthorizedResponse();
        });

        it('Should show a loginWindow.', function ()
        {
            // Called with a form instance, but i have no clue how to get this form.
            expect(authController.showNSWindow).toHaveBeenCalled();
        });

        it('Should focus the identity field.', function ()
        {
            expect(nsForm.focusField).toHaveBeenCalledWith('identity');
        });

        it('Should load a authentication shell', function ()
        {
            expect(nsForm.loadModel).toHaveBeenCalled();
        });
    });

    describe('onLogin', function ()
    {
        var nsForm;

        beforeEach(function ()
        {
            nsForm = BM.kernel.ns.Form.prototype;

            spyOn(authController, 'onLoginResponse');
            spyOn(nsForm, 'saveModel');
        });

        it('Should return early if there is no form, the form is invalid or the controller isAuthenticating equals true', function ()
        {
            var result;

            authController.isAuthenticating = true;
            result = authController.onLogin();
            expect(result).toBeFalsy();

            authController.isAuthenticating = false;
            result = authController.onLogin();
            expect(result).toBeFalsy();
        });

        it('Should do a login request', function ()
        {
            var saveModelConfig,
                getLoginFormResult,
                userModel,
                loginForm,
                result;

            saveModelConfig = {
                loadMaskMsg : 'Authenticating...', // TEXT
                scope : authController,
                callback : authController.onLoginResponse
            };

            getLoginFormResult = {
                isValid : function () {
                    return true;
                }
            };

            // Setup a login form, fill it and trigger the submit.
            userModel = authController.getNSModel('User');
            loginForm = authController.getNSForm('Login', {
                model : userModel
            });

            loginForm.findField('identity').setValue('Username');
            loginForm.findField('credential').setValue('Password');

            authController.onLogin();

            expect(nsForm.saveModel).toHaveBeenCalledWith(saveModelConfig);
        });
    });

    describe('onLoginResponse', function ()
    {
        var authModelIsAuthenticated,
            authModelMsg,
            authModel,
            closeSpy,
            app;

        beforeEach(function ()
        {
            app = authController.getApplication();

            authModelIsAuthenticated = false;
            authModelMsg = 'Foobar';
            authModel = {
                get : function ()
                {
                    return authModelIsAuthenticated;
                },
                getMsg : function ()
                {
                    return authModelMsg;
                }
            };

            closeSpy = jasmine.createSpy('close');
            spyOn(authController, 'getLoginWindow').andReturn({
                close : closeSpy // This is cool :), the login window close action is an spy.
            });
            spyOn(Ext.Msg, 'alert');
            spyOn(app, 'loadProfile');

        });

        it('Should early return if the authentication request fail', function ()
        {
            var result;

            authController.isAuthenticating = true;

            result = authController.onLoginResponse(authModel, 'unused', false);

            expect(authController.isAuthenticating).toBeFalsy();

            expect(Ext.Msg.alert).toHaveBeenCalledWith('Not authenticated', authModelMsg);
            expect(result).toBeFalsy();

            result = undefined;
            authModelIsAuthenticated = false;
            authModelMsg = null;
            result = authController.onLoginResponse(authModel, 'unused', true);

            expect(Ext.Msg.alert).toHaveBeenCalledWith('Not authenticated', 'Authentication fail because of an unknown error.');
            expect(result).toBeFalsy();
        });

        it('Should close the login window', function ()
        {
            var result;

            authModelIsAuthenticated = true;

            result = authController.onLoginResponse(authModel, 'unused', true);

            expect(closeSpy).toHaveBeenCalled();
            expect(result).toBeTruthy();
        });

        it('Should call BM.kernel.Profile#loadProfile', function ()
        {
            var profile = BM.kernel.Profile.prototype;
            spyOn(profile, 'loadProfile');

            authModelIsAuthenticated = true;

            authController.onLoginResponse(authModel, 'unused', true);

            expect(app.loadProfile).toHaveBeenCalled();
        });
    });

    describe('onLogout', function ()
    {
        it('Should show a confirm dialog', function ()
        {
            var result;

            spyOn(Ext.Msg, 'confirm');

            result = authController.onLogout();

            expect(result).toBeTruthy();
            expect(Ext.Msg.confirm).toHaveBeenCalledWith(
                'Logout', 'Are you sure you want to logout.',
                authController.onConfirmSessionDestroy, authController);
        });
    });

    describe('onConfirmSessionDestroy', function ()
    {
        it('Should return early if the buttonId not equals yes', function ()
        {
            var result = authController.onConfirmSessionDestroy('no');

            expect(result).toBeFalsy();
        });

        it('Should do a logout request', function ()
        {
            var result,
                sessionDestroyConfig = {
                    url : '/user/auth/logout',
                    method : 'GET',
                    callback : authController.onSessionDestroyResponse
                };

            spyOn(Ext.Ajax, 'request');

            result = authController.onConfirmSessionDestroy('yes');

            expect(result).toBeTruthy();
            expect(Ext.Ajax.request).toHaveBeenCalledWith(sessionDestroyConfig);
        });
    });

    describe('onSessionDestroyResponse', function ()
    {   
        it('Should return early is the logout request fail', function ()
        {
            var result;
            
            spyOn(Ext.Error, 'raise');
            
            result = authController.onSessionDestroyResponse('unused', false, 'unused');
            expect(result).toBeFalsy();
            expect(Ext.Error.raise).toHaveBeenCalledWith('You are not logged out.');
        });
        
        it('Should call BM.App#logoff', function ()
        {
            var app = authController.getApplication();
            
            spyOn(app, 'logoff');
            
            authController.onSessionDestroyResponse('unused', true, 'unused');
            
            expect(app.logoff).toHaveBeenCalled();
        });
    });
});