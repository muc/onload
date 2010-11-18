
PermissionWin = Ext.extend(Ext.Window, {
    title: 'Permission for FolderName',
    width: 690,
    height: 324,
    layout: 'hbox',
    buttonAlign: 'center',
    frame: true,
    folder: {
      ptype: 2,
      pusers: [
        {username: 'Hans', write: true}
      ] 
    },
    listeners: {
      show: function() {
        Ext.getCmp('ptCombo').setValue(this.folder.ptype);
      }
    },
    
    initComponent: function() {
        this.layoutConfig = {
            align: 'stretch'
        };
        this.items = [
            {
                xtype: 'grid',
                title: 'forbidden users',
                flex: 1,
                autoExpandColumn: 'fgUserName',
                id: 'fGrid',
                store: 'pfStore',
                columns: [
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'string',
                        header: 'User name',
                        sortable: true,
                        resizable: false,
                        editable: false,
                        id: 'fgUserName'
                    }
                ]
            },
            {
                xtype: 'grid',
                title: 'permitted users',
                flex: 1,
                autoExpandColumn: 'pgUserName',
                id: 'pGrid',
                store: 'pfStore',
                columns: [
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'string',
                        header: 'User name',
                        sortable: true,
                        resizable: false,
                        editable: false,
                        id: 'pgUserName'
                    },
                    {
                        xtype: 'booleancolumn',
                        dataIndex: 'bool',
                        header: 'Upload',
                        sortable: true,
                        width: 50,
                        id: 'pgWrite'
                    }
                ]
            }
        ];
        this.tbar = {
            xtype: 'toolbar',
            buttonAlign: 'center',
            items: [
                {
                    xtype: 'label',
                    text: 'General permission'
                },
                {
                    xtype: 'spacer',
                    width: 20
                },
                {
                    xtype: 'combo',
                    id: 'ptCombo',
                    store: 'pTypeStore',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    valueField: 'ptid',
                    displayField: 'name',
                }
            ]
        };
        this.fbar = {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    text: 'Save',
                    scope: this,
                    handler: this.onSave
                },
                {
                    xtype: 'button',
                    text: 'Close',
                    scope: this,
                    handler: this.onClose
                }
            ]
        };
        this.addEvents(
          'onSave'
        );
        PermissionWin.superclass.initComponent.call(this);
    },
    
    loadFolder: function(folder) {
      this.folder = folder;
    },
    
    onSave: function() {
      this.fireEvent('save');
      this.close();
    },
    
    onClose: function() {
      this.close();
    }
});
