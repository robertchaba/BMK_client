function getIconsStore ()
{
    var sheets = document.styleSheets,
        iconsStore,
        iconClsNames = [
        ],
        cssRules;

    // Find font-awesome style
    Ext.Array.each(sheets, function (sheet)
    {
        var href = sheet.href;

        if (href && href.indexOf('font-awesome.css') !== -1) {
            cssRules = sheet.cssRules;
            // End, Stop iteration.
            return false;
        }
    });

    // Find icon clsname.
    Ext.Object.each(cssRules, function (k, rule)
    {
        var text = rule.selectorText,
            iconClsPatt = /\.(fa|icon)-(.*)::befores?/g,
            clsNameEndPos,
            clsName,
            name;

        if (iconClsPatt.test(text)) {
            clsNameEndPos = text.indexOf(':');
            clsName = text.slice(1, clsNameEndPos);
            name = clsName.replace(/(fa|icon)-(.*)/g, '$2').replace(/-/g, ' ');

            iconClsNames.push({
                cls : clsName,
                name : name
            });
        }
    });
    iconsStore = Ext.create('Ext.data.Store', {
        fields : [
            'cls',
            'name'
        ],
        data : iconClsNames,
        sorters : [
            {
                property : 'name'
            }
        ]
    });

    // End.
    return iconsStore;
}

/**
 * Font-awesome icon combobox.
 * This combobox shows all Font-awesome 3 & 4 icons found in the style.
 * There is no need to assign a store, this component serves a own store.
 */
Ext.define('BM.ux.form.field.IconComboBox', {
    extend : 'Ext.form.field.ComboBox',
    alias : [
        'widget.iconcombobox',
        'widget.iconcombo'
    ],
    store : getIconsStore(),
    queryMode : 'local',
    displayField : 'name',
    valueField : 'cls',
    forceSelection : true,
    typeAhead : true,
    listConfig : {
        getInnerTpl : function ()
        {
            // End.
            return '<div><span style="font-size:24px;" class="fa {cls}"></span> {name}</div>';
        }
    }
});