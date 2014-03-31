describe('Test User.model.Person', function () {
    var personModel;

    beforeEach(function () {
        Ext.syncRequire('User.model.Person');

        personModel = Ext.create('User.model.Person');
    });

    afterEach(function () {
        personModel = undefined;
    });

    it('Class should be loaded', function ()
    {
        expect(User.model.Person).toBeDefined();
    });
    
    it('Class should be a ns model.', function ()
    {
        expect(personModel.isNSModel).toBeTruthy();
    });

    describe('getFullname', function () {
        it('Should return a long fullname', function () {
            var name = 'Jan met de Pet',
                result;

            personModel.set('firstname', 'Jan');
            personModel.set('middlename', 'met de');
            personModel.set('lastname', 'Pet');
            result = personModel.getFullname();

            expect(result).toBe(name);
        });

        it('Should return a short fullname', function () {
            var name = 'John Doe',
                result;

            personModel.set('firstname', 'John');
            personModel.set('lastname', 'Doe');
            result = personModel.getFullname();

            expect(result).toBe(name);
        });
    });

    describe('getAvatar', function () {

        beforeEach(function () {
            Ext.syncRequire('Model.user.File');
            Ext.syncRequire('User.model.Person');

            var fileModel = Ext.create('Model.user.File');
            personModel.setFile(fileModel);
        });

        it('Should return a 35x35 default avatar url.', function () {
            var url = '/resources/images/application/35x35/default-avatar.png',
                result = personModel.getAvatar();

            expect(result).toBe(url);
        });

        it('Should return a 100x100 default avatar url.', function () {
            var url = '/resources/images/application/100x100/default-avatar.png',
                result = personModel.getAvatar('100x100');

            expect(result).toBe(url);
        });

        it('Should return a 35x35 custom avatar url.', function () {
            var url = '/download/35x35/testfile.png',
                fileModel = personModel.getFile(),
                result;

            fileModel.set('name', 'testfile');
            fileModel.set('extension', 'png');
            result = personModel.getAvatar();

            expect(result).toBe(url);
        });
        
        it('Should return a 120x120 custom avatar url.', function () {
            var url = '/download/120x120/otherfile.gif',
                fileModel = personModel.getFile(),
                result;

            fileModel.set('name', 'otherfile');
            fileModel.set('extension', 'gif');
            result = personModel.getAvatar('120x120');

            expect(result).toBe(url);
        });
    });
});