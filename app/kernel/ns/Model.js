/**
 * Abstract NS model which defines model helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Model', {
    extend : 'Ext.data.Model',
    /**
     * @property {Boolean} isNSModel true to identify this class as namespace model.
     */
    isNSModel : true,
    /**
     * Return a associated model by name.
     * 
     * @param {String} name
     * @return {Ext.data.Model|Ext.data.Store} // TODO Check what if they are many relations
     */
    getAssociation : function (name)
    {
        var me = this,
            associations = me.associations,
            association = associations.get(name),
            model;

        if (!association || !(typeof association.associatedModel === 'function')) {
            // End, Association not 
            return false;
        }

        // End.
        return association.associatedModel;
    },
    /**
     * Get the response message.
     * 
     * @return {String}
     */
    getMsg : function ()
    {
        var me = this,
            proxy = me.getProxy(),
            reader = proxy.getReader(),
            raw = reader.rawData,
            msg = reader.getMessage(raw);

        // End.
        return msg;
    }
});