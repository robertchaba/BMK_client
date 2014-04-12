describe('Test BM.App', function ()
{
    var app;
    beforeEach(function ()
    {
        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        app = BM.app;
    });

    afterEach(function ()
    {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM).toBeDefined();
    });

    it('Should create viewport references methods', function ()
    {
        expect(typeof app.getNorthRegion).toBe('function');
        expect(typeof app.getEastRegion).toBe('function');
        expect(typeof app.getSouthRegion).toBe('function');
        expect(typeof app.getWestRegion).toBe('function');
        expect(typeof app.getCenterRegion).toBe('function');
    });

    it('Should load required mixin classes', function ()
    {
        var mixins = app.mixins;

        expect(mixins.acl).toBeDefined();
        expect(mixins.contextmenu).toBeDefined();
        expect(mixins.errorHandler).toBeDefined();
        expect(mixins.logger).toBeDefined();
        expect(mixins.navigation).toBeDefined();
        expect(mixins.profile).toBeDefined();
        expect(mixins.workspace).toBeDefined();
    });

    describe('BM.getApplication', function ()
    {
        it('Should return the application instance', function ()
        {
            expect(typeof BM.getApplication).toBe('function');
        });
    });

    describe('#init', function ()
    {
        // Unable to test the init method.
        // The init method is hardcoded to return early if jasmine in loaded.
    });

    describe('#launch', function ()
    {
        // Unable to test the launch method.
        // The launch method is hardcoded to return early if jasmine in loaded.
    });

    describe('logon', function ()
    {
        var isAuthenticatedSpy,
            hideSpy;
        beforeEach(function ()
        {
            // BM.kernel.Profile
            isAuthenticatedSpy = spyOn(app, 'isAuthenticated');
            // BM.kernel.Acl
            spyOn(app, 'initAcl');
            // BM.kernel.Workspace
            spyOn(app, 'initWorkspace');
            // BM.kernel.Navigation
            spyOn(app, 'initNavigation');
            // BM.kernel.Contextmenu
            spyOn(app, 'initContextmenu');
            //
            hideSpy = jasmine.createSpy('hide');
            spyOn(app, 'getThrobber').andReturn({
                hide : hideSpy
            });
        });

        it('Should return early if the user is unauthenticated', function ()
        {
            var result;
            isAuthenticatedSpy.andReturn(false);

            result = app.logon();

            expect(result).toBeFalsy();

            expect(app.isAuthenticated).toHaveBeenCalled();
        });

        it('Should initialize all profile requiring classes', function ()
        {
            var result;
            isAuthenticatedSpy.andReturn(true);

            result = app.logon();

            expect(result).toBeTruthy();
            //
            expect(app.initAcl).toHaveBeenCalled();
            expect(app.initWorkspace).toHaveBeenCalled();
            expect(app.initNavigation).toHaveBeenCalled();
            expect(app.initContextmenu).toHaveBeenCalled();
            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('logoff', function ()
    {
        it('Should destroy all profile requiring classes', function ()
        {
            var result;

            spyOn(app, 'destroyAcl');
            spyOn(app, 'destroyNavigation');
            spyOn(app, 'destroyWorkspace');
            spyOn(app, 'loadProfile');

            result = app.logoff();

            expect(result).toBeTruthy();
            expect(app.destroyAcl).toHaveBeenCalled();
            expect(app.destroyNavigation).toHaveBeenCalled();
            expect(app.destroyWorkspace).toHaveBeenCalled();
            expect(app.loadProfile).toHaveBeenCalledWith(app.logon, app);
        });
    });

    describe('getApplicationLogo', function ()
    {
        it('Should return a simple object', function ()
        {
            var result = app.getApplicationLogo();

            expect(typeof result).toBe('object');
            expect(result.xtype).toBe('image');
            expect(result.src).toBeDefined();
            expect(result.width).toBeDefined();
            expect(result.height).toBeDefined();
        });
    });

    describe('maximize', function ()
    {
        it('Should call addTab', function ()
        {
            var result,
                panel = {
                    closable : false
                };

            spyOn(app, 'addTab');

            result = app.maximize(panel);

            expect(result).toBeTruthy();
            expect(app.addTab).toHaveBeenCalledWith(panel);
        });
    });

    describe('initStateHandler', function ()
    {
        // Not implemented.
    });

    describe('captureCallback', function ()
    {
        var config = {
            scope : app,
            callback : undefined,
            mitm : {
                scope : app,
                callback : undefined,
                arguments : [
                ]
            }
        };

        beforeEach(function ()
        {
            config.callback = function ()
            {
                return 'cb';
            };

            config.mitm.callback = function ()
            {
                return 'mitmCb';
            };
        });

        it('Should return early if the mitm callback is not a function', function ()
        {
            var result;

            config.mitm.callback = 'not a function';

            result = app.captureCallback(config);

            expect(result.callback()).toEqual('cb');
        });

        it('Should capture the callback method', function ()
        {
            var result;

            result = app.captureCallback(config);

            expect(result.callback()).not.toEqual('cb');
        });
    });

    describe('isModuleLoaded', function ()
    {
        var getAllowedControllersSpy;
        beforeEach(function()
        {
            // BM.kernel.Acl
            getAllowedControllersSpy = spyOn(app, 'getAllowedControllers');
        });
        
        it('Should return falsy if the module does not contain controllers', function ()
        {
            var result,
                controllers = [];
            
            getAllowedControllersSpy.andReturn(controllers);
            
            result = app.isModuleLoaded('foo');
            
            expect(result).toBeFalsy();
            expect(app.getAllowedControllers).toHaveBeenCalledWith('foo');
        });
        
        it('Should return truthy is the module does contain controllers.', function ()
        {
            var result,
                controllers = [
                    'testController'
                ];
            
            getAllowedControllersSpy.andReturn(controllers);
            
            result = app.isModuleLoaded('bar');
            
            expect(result).toBeTruthy();
            expect(app.getAllowedControllers).toHaveBeenCalledWith('bar');
        });
    });
});
