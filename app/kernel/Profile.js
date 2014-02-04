/**
 * A {@link BM.Application} mixin for accessing all user personal data, collect
 * logs and bootstrap the appliction after the user is authenticated.
 */
Ext.define('BM.kernel.Profile', {
    uses : [
        'User.model.Profile'
    ],
    /**
     * @private
     * @property {BM.model.user.Profile} profileModel.
     */

    /**
     * @private
     * @property {BM.model.user.Person} personModel
     */

    /**
     * @private
     * @property {BM.model.user.Setting} settingsModel
     */

    /**
     * @private
     * @property {BM.model.user.Locale} localeModel
     */

    /**
     * @param {BM.App} app
     * @chainable
     */
    initProfile : function ()
    {
        var me = this;

        // End.
        return me;
    },
    /**
     * Try to load the user profile.
     *
     * The given callback will be cancelled if the profile is not loaded.
     * Else if the profile is loaded, the profile will be populated and the given
     * callback will be called.
     *
     * @param {Function} callback
     * @param {Object} [scope] description
     * @return {Boolean} Void.
     */
    loadProfile : function (callback, scope)
    {
        scope = scope || this;

        var me = this,
            config;

        config = BM.getApplication().captureCallback({
            callback : callback,
            scope : scope,
            mitm : {
                callback : me.onProfileLoaded,
                scope : me
            }
        });

        BM.model.user.Profile.load(0, config);

        // End.
        return true;
    },
    /**
     * Chekc if the user is authenticated and if all required profile data is present.
     *
     * @return {Boolean} Whether the user is authenticated.
     */
    isAuthenticated : function ()
    {
        var me = this,
            userModel = me.getProfileModel();

        if (userModel.get('isActive') !== true) {
            // End, User is not marked active.
            return false;
        }

        if (!me.getProfileModel() || !me.getPersonModel() || !me.getSettingsModel) {
            // End, Required data is not present.
            return false;
        }

        // End.
        return true;
    },
    /**
     * Set a {BM.model.user.Profile} model instance and set all associated models.
     *
     * @param {BM.model.user.Profile} profile
     * @chainable
     */
    setProfileModel : function (profile)
    {
        var me = this;

        me.profileModel = profile;
        me.setPersonModel(profile.getPerson());
        me.setSettingsModel(profile.getSetting());
        BM.getApplication().setACLPermissions(profile.raw.permissions);

        // End.
        return me;
    },
    /**
     * Return a {BM.model.user.Profile} model instance.
     *
     * @return {BM.model.user.Profile}
     */
    getProfileModel : function ()
    {
        var me = this,
            profile = me.profileModel;

        if (!profile || !profile.isNSModel) {
            // End.
            BM.getApplication().logError('User model is not loaded.');
            return false;
        }

        // End.
        return profile;
    },
    /**
     * Set a {BM.model.user.Person} model instance.
     *
     * @param {BM.model.user.Person} person
     * @chainable
     */
    setPersonModel : function (person)
    {
        var me = this;
        me.personModel = person;
        // End.
        return me;
    },
    /**
     * Return a {BM.model.user.Person} model instance.
     *
     * @return {BM.model.user.Person}
     */
    getPersonModel : function ()
    {
        var me = this,
            person = me.personModel;

        if (!person || !person.isNSModel) {
            // End.
            BM.getApplication().logError('Person model is not loaded.');
            return false;
        }

        // End.
        return person;
    },
    /**
     * Set a {BM.model.user.Setting} model instance.
     *
     * @param {BM.model.user.Setting} settings
     * @chainable
     */
    setSettingsModel : function (settings)
    {
        var me = this;
        me.settingsModel = settings;
        // End.
        return me;

    },
    /**
     * Return a {BM.model.user.Setting} model instance.
     *
     * @return {BM.model.user.Setting}
     */
    getSettingsModel : function ()
    {
        var me = this,
            settings = me.settingsModel;

        if (!settings || !settings.isNSModel) {
            // End.
            BM.getApplication().logError('Settings model is not loaded.');
            return false;
        }

        // End.
        return settings;
    },
    /**
     * If the profile is loaded the profile model will be
     * {@link #setProfileModel populated}.
     *
     * @private
     * @return {Boolean} False if the profile is not loaded, True otherwise.
     */
    onProfileLoaded : function (profile, operation, isSuccess)
    {
        var me = this;

        if (!isSuccess) {
            // End. Profile can not be loaded, user is not authenticated.
            BM.getApplication().logNotice('Profile is not loaded');
            return false;
        }

        me.setProfileModel(profile);

        // End.
        return true;
    }
});