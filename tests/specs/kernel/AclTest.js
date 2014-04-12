describe('Test BM.kernel.Acl', function ()
{
    var acl,
        permissions;
    beforeEach(function ()
    {
        permissions = {
            app : {
                controllers : {
                    index : {
                        actions : {
                            index : {
                                icon : 'icon-action',
                                isNavigation : false,
                                isQuickmenu : false,
                                isToolbar : false,
                                label : 'index action',
                                name : 'index',
                                title : 'index'
                            }
                        },
                        icon : 'icon-controller',
                        isNavigation : false,
                        isToolbar : false,
                        label : 'index controller',
                        name : 'index',
                        title : 'index'
                    },
                    foo : {
                    },
                    icon : 'icon-controller',
                    isNavigation : false,
                    isToolbar : false,
                    label : 'foo controller',
                    name : 'foo',
                    title : 'foo'
                },
                icon : 'icon-app',
                isNavigation : false,
                label : 'app module',
                name : 'app',
                title : 'app'
            },
            bar : {}
        };

        Ext.syncRequire('BM.App');
        Ext.application('BM.App');

        acl = new BM.kernel.Acl();
    });

    afterEach(function () {
        Ext.ComponentQuery.query('viewport')[0].destroy();
    });

    it('Class should be loaded', function ()
    {
        expect(BM.kernel.Acl).toBeDefined();
    });

    describe('initAcl', function ()
    {
        it('Should define a hashMap for the allowed controllers', function ()
        {
            var hashMap = new Ext.util.HashMap(),
                result;

            result = acl.initAcl();

            expect(result).toBeTruthy();
            expect(acl.allowedControllers).toEqual(hashMap);
        });
    });

    describe('destroyAcl', function ()
    {
        it('Should reset acl properties', function ()
        {
            var result;

            acl.allowedControllers = [
            ];
            acl.ACLPermissions = {};

            result = acl.destroyAcl();

            expect(result).toBeTruthy();
            expect(acl.allowedControllers).toBe(null);
            expect(acl.ACLPermissions).toBe(null);
        });
    });

    describe('setAclPermissions', function ()
    {
        it('Should set Acl permissions', function ()
        {
            var result,
                permissions = {};

            acl.AclPermissions = null;

            result = acl.setACLPermissions(permissions);

            expect(result).toBeTruthy();
            expect(acl.ACLPermissions).toBe(permissions);
        });
    });

    describe('getAclPermissions', function ()
    {
        beforeEach(function ()
        {
            acl.ACLPermissions = permissions;
        });

        it('Should use an empty object if no permissions are defined', function ()
        {
            var result;

            acl.ACLPermissions = null;

            result = acl.getACLPermissions();

            expect(result).toEqual({});
        });

        it('Should return all permissions', function ()
        {
            var result = acl.getACLPermissions();

            expect(result).toEqual(permissions);
        });

        it('Should return all permission for the requested module', function ()
        {
            var result = acl.getACLPermissions('app');

            expect(result).toEqual({
                app : permissions.app
            });
        });

        it('Should return all permissions for the request controller', function ()
        {
            var result = acl.getACLPermissions('app', 'index'),
                tmp = permissions.app.controllers.index;

            delete tmp.foo;

            permissions.app.controllers = {};
            permissions.app.controllers.index = tmp;

            expect(result).toEqual({
                app : permissions.app
            });
        });
    });

    describe('allowed', function ()
    {
        var getACLPermissionsSpy;

        beforeEach(function ()
        {
            getACLPermissionsSpy = spyOn(acl, 'getACLPermissions');
        });

        afterEach(function ()
        {
        });

        it('Should return falsy if the module does not exist', function ()
        {
            var result,
                module = 'test',
                controller = 'index',
                action = 'add';

            getACLPermissionsSpy.andReturn({
            });

            result = acl.allowed(module, controller, action);

            expect(result).toBeFalsy();
            expect(acl.getACLPermissions).toHaveBeenCalledWith(module, controller);
        });

        it('Should return falsy if the controller does not exist', function ()
        {
            var result,
                module = 'app',
                controller = 'bar',
                action = 'add';

            getACLPermissionsSpy.andReturn(permissions);

            result = acl.allowed(module, controller, action);

            expect(result).toBeFalsy();
            expect(acl.getACLPermissions).toHaveBeenCalledWith(module, controller);
        });

        it('Should return falsy if the action does not exist', function ()
        {
            var result,
                module = 'app',
                controller = 'index',
                action = 'add';

            getACLPermissionsSpy.andReturn(permissions);

            result = acl.allowed(module, controller, action);

            expect(result).toBeFalsy();
            expect(acl.getACLPermissions).toHaveBeenCalledWith(module, controller);
        });

        it('Should return truthy if the action does exist', function ()
        {
            var result,
                module = 'app',
                controller = 'index',
                action = 'index';

            getACLPermissionsSpy.andReturn(permissions);

            result = acl.allowed(module, controller, action);

            expect(result).toBeTruthy();
            expect(acl.getACLPermissions).toHaveBeenCalledWith(module, controller);
        });
    });

    describe('getAllowedNavigation', function ()
    {
        it('Should call getAllowedMenu', function ()
        {
            var result;

            spyOn(acl, 'getAllowedMenu');

            result = acl.getAllowedNavigation();

            expect(acl.getAllowedMenu).toHaveBeenCalledWith('navigation', 'isNavigation', true);
        });
    });

    describe('getAllowedQuickmenu', function ()
    {
        it('Should call getAllowedMenu', function ()
        {
            var result;

            spyOn(acl, 'getAllowedMenu');

            result = acl.getAllowedQuickmenu();

            expect(acl.getAllowedMenu).toHaveBeenCalledWith('quickmenu', 'isQuickmenu', true, 2);
        });
    });

    describe('getAllowedToolbar', function ()
    {
        var getACLPermissionsSpy;

        beforeEach(function ()
        {
            getACLPermissionsSpy = spyOn(acl, 'getACLPermissions');
            spyOn(acl, 'getAllowedMenu');
        });

        it('Should call getAllowedMenu', function ()
        {
            var result,
                module = 'index',
                controller = 'index',
                tmp = permissions.app.controllers.index;

            delete tmp.foo;

            permissions.app.controllers = {};
            permissions.app.controllers.index = tmp;

            getACLPermissionsSpy.andReturn(permissions);

            result = acl.getAllowedToolbar(module, controller);

            expect(acl.getACLPermissions).toHaveBeenCalledWith(module, controller);
            expect(acl.getAllowedMenu).toHaveBeenCalledWith('toolbar', 'isToolbar', true, 2, permissions);
        });
    });

    describe('getAllowedControllers', function ()
    {
        beforeEach(function ()
        {
        });

        afterEach(function ()
        {
        });
        
        it('Should flush the controllers cache', function ()
        {
        });
        
        it('Should return the controllers cache', function ()
        {
        });
        
        // Better to make a new describe ?
    });

    describe('getAllowedMenu', function ()
    {
        beforeEach(function ()
        {
        });

        afterEach(function ()
        {
        });
    });
});
