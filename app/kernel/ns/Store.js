/**
 * Abstract NS store which defines store helper methods and default configuration.
 * 
 * @abstract
 */
Ext.define('BM.kernel.ns.Store', {
    extend : 'Ext.data.Store',
    /**
     * @property {Boolean} isNSStore true to identify this class as namespace store.
     */
    isNSStore : true,
    remoteFilter : true
});