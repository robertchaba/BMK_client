
/**
 * Fix {@link Ext.panel.Header#iconCls iconCls}.
 * Use a component to render the icon in, instead of a image.
 */
Ext.override(Ext.panel.Header, {
    initIconCmp : function ()
    {
        var me = this,
            cls = [
                me.headerCls + '-icon',
                me.baseCls + '-icon',
                me.iconCls
            ],
            cfg;

        if (me.glyph) {
            cls.push(me.baseCls + '-glyph');
        }

        cfg = {
            focusable : false,
            src : Ext.BLANK_IMAGE_URL,
            cls : cls,
            baseCls : me.baseCls + '-icon',
            id : me.id + '-iconEl',
            iconCls : me.iconCls,
            glyph : me.glyph
        };

        if (!Ext.isEmpty(me.icon)) {
            delete cfg.iconCls;
            cfg.src = me.icon;
        }

        // Update, Use a component, instead of a img
        me.iconCmp = new Ext.Component(cfg);
    }
});

/**
 * Fix saving of associated data.
 * Models with associations will also save the associations.
 */
Ext.override(Ext.data.writer.Writer, {
    getRecordData : function (record, operation)
    {
        var me = this,
            writer = record.getProxy().getWriter(),
            writeValue = function (data, field, record)
            {
                var name = field[writer.nameProperty] || field.name,
                    dateFormat = writer.dateFormat || field.dateWriteFormat || field.dateFormat,
                    value = record.get(field.name);

                if (field.serialize) {
                    data[name] = field.serialize(value, record);
                } else if (field.type === Ext.data.Types.DATE && dateFormat && Ext.isDate(value)) {
                    data[name] = Ext.Date.format(value, dateFormat);
                } else {
                    data[name] = value;
                }
            },
            isPhantom = record.phantom === true,
            writeAll = me.writeAllFields || isPhantom,
            fields = record.fields,
            fieldItems = fields.items,
            data = {},
            clientIdProperty = record.clientIdProperty,
            changes,
            field,
            key,
            f,
            fLen;

        if (writeAll) {
            fLen = fieldItems.length;

            for (f = 0; f < fLen; f++) {
                field = fieldItems[f];
                if (field.persist) {
                    writeValue(data, field, record);
                }
            }
        } else {
            // Only write the changes
            changes = record.getChanges();
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    field = fields.get(key);
                    if (field.persist) {
                        writeValue(data, field, record);
                    }
                }
            }
        }
        if (isPhantom) {
            if (clientIdProperty && operation && operation.records.length > 1) {
                // include clientId for phantom records, if multiple records are being written to the server in one operation.
                // The server can then return the clientId with each record so the operation can match the server records with the client records
                data[clientIdProperty] = record.internalId;
            }
        } else {
            // always include the id for non phantoms
            data[record.idProperty] = record.getId();
        }

        Ext.applyIf(data, record.getAssociatedData());

        return data;
    }
});

/**
 * Fix associated getter methods.
 * Do not load or reload the associated model. 
 */
Ext.override(Ext.data.association.HasOne, {
    createGetter : function () {
        var me = this,
            ownerModel = me.ownerModel,
            associatedName = me.associatedName,
            associatedModel = me.associatedModel,
            foreignKey = me.foreignKey,
            primaryKey = me.primaryKey,
            instanceName = me.instanceName;

        //'this' refers to the Model instance inside this function
        return function (options, scope) {
            options = options || {};

            var model = this,
                foreignKeyId = model.get(foreignKey),
                success,
                instance,
                args;

            if (options.reload === true || model[instanceName] === undefined) {
                instance = Ext.ModelManager.create({}, associatedName);
                instance.set(primaryKey, foreignKeyId);

                if (typeof options === 'function') {
                    options = {
                        callback : options,
                        scope : scope || model
                    };
                }

                // Overwrite the success handler so we can assign the current instance
                success = options.success;
                options.success = function (rec) {
                    model[instanceName] = rec;
                    if (success) {
                        success.apply(this, arguments);
                    }
                };

                // I don't see a good reason to load empty models.
                // This lead to errors if the model isn't configured properly.
                //associatedModel.load(foreignKeyId, options);
                // assign temporarily while we wait for data to return
                model[instanceName] = instance;
                return instance;
            } else {
                instance = model[instanceName];
                args = [
                    instance
                ];
                scope = scope || options.scope || model;

                //TODO: We're duplicating the callback invokation code that the instance.load() call above
                //makes here - ought to be able to normalize this - perhaps by caching at the Model.load layer
                //instead of the association layer.
                Ext.callback(options, scope, args);
                Ext.callback(options.success, scope, args);
                Ext.callback(options.failure, scope, args);
                Ext.callback(options.callback, scope, args);

                return instance;
            }
        };
    }
});

/**
 * Fix {@link Ext.data.validations#length Length validation} replace the given
 * value with a empty string if the values is undefined or null.
 */
Ext.override(Ext.data.validations, {
    length : function (config, value) {
        if (value === undefined || value === null) {
            value = '';
        }

        var length = value.length,
            min = config.min,
            max = config.max;

        if ((min && length < min) || (max && length > max)) {
            return false;
        } else {
            return true;
        }
    }
});

/**
 * Update the {@link Ext.app.Controller#control} method to prefix the view event
 * selectors with the controller name if the selector starts with a dot (.).
 * 
 *     // Application.controller.Foo
 *     me.control({
 *         // Navigation
 *         '#controllerViewId' : {
 *             click : me.onClick
 *         },
 *         '.sharedViewId' : {
 *             render : me.onSharedRender
 *         }
 *     });
 * 
 * .sharedViewId will be application_sharedViewId.
 */
Ext.override(Ext.app.EventBus, {
    control : function (selectors, controller) {
        var controllername;

        Ext.Object.each(selectors, function (selector, listeners)
        {
            if (selector.charAt(0) === '.' && controller.isNSController) {
                delete selectors[selector];
                controllername = controller.getControllerName().toLowerCase();
                selector = '#' + (controllername + selector).replace('.', '_');
                selectors[selector] = listeners;
            }
        });

        return this.domains.component.listen(selectors, controller);
    }
});