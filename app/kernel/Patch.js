
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

        Ext.apply(data, record.getAssociatedData());

        return data;
    }
});