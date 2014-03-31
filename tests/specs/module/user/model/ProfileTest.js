describe('Test User.model.Profile', function () {
    var profileModel;
    
    beforeEach(function () {
        Ext.syncRequire('User.model.Profile');
        
        profileModel = Ext.create('User.model.Profile');
    });
    
    afterEach(function () {
        profileModel = undefined;
    });

    it('Class should be loaded', function ()
    {
        expect(User.model.Profile).toBeDefined();
    });
    
    it('Class should be a ns model.', function ()
    {
        expect(profileModel.isNSModel).toBeTruthy();
    });
});
