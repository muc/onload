
PermissionWin = Ext.extend(Ext.Window, {
    title: 'Permission for FolderName',
    width: 690,
    height: 324,
    layout: 'hbox',
    buttonAlign: 'center',
    frame: true,
    data: {
      ptype: 1,
      fid: 0,
    },
    listeners: {
      show: function() {
        this.initGrids();
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
                enableDragDrop: true,
                ddGroup: 'pGridDDGroup',
                id: 'fGrid',
                loadMask: true,
                store: 'pfStore',
                columns: [
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'username',
                        header: 'User name',
                        sortable: true,
                        menuDisabled: true,
                        resizable: false,
                        editable: false,
                        id: 'fgUserName'
                    }
                ]
            },
            {
                xtype: 'editorgrid',
                title: 'permitted users',
                flex: 1,
                height: 324,
                autoExpandColumn: 'pgUserName',
                enableDragDrop: true,
                ddGroup: 'fGridDDGroup',
                id: 'pGrid',
                loadMask: true,
                store: 'ppStore',
                sm: new Ext.grid.RowSelectionModel({
                  singleSelect: false,
                }),
                columns: [
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'username',
                        header: 'User name',
                        sortable: true,
                        menuDisabled: true,
                        resizable: false,
                        editable: false,
                        id: 'pgUserName'
                    },
                    {
                        dataIndex: 'upload',
                        header: 'Upload',
                        sortable: true,
                        menuDisabled: true,
                        resizable: false,
                        width: 50,
                        id: 'pgWrite',
                        editor: { xtype: 'checkbox' },
                        renderer: function(value) {
                          return value ? '<img src="assets/img/tick.png" width="10px" height="10px"/>' : '<img src="assets/img/cross.png" width="10px" height="10px"/>';
                        }
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
                    listeners: {
                      scope: this,
                      select: this.doUpdateLayout
                    }
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
    
    loadData: function(data) {
      this.data = data;
      pfStore.load({params:{fid:this.data.fid}});
      ppStore.load({params:{fid:this.data.fid}});
    },
    
    initGrids: function() {
      Ext.getCmp('ptCombo').setValue(this.data.ptype);
      Ext.getCmp('fGrid').setVisible(this.data.ptype == 2);
      Ext.getCmp('pGrid').setVisible(this.data.ptype == 2);
      
      var fGrid = Ext.getCmp('fGrid');
      var pGrid = Ext.getCmp('pGrid');
      
      fGrid.store.sort('username', 'ASC');
      pGrid.store.sort('username', 'ASC');
      
      var fGridDropTargetEl =  fGrid.getView().scroller.dom;
      var fGridDropTarget = new Ext.dd.DropTarget(fGridDropTargetEl, {
        ddGroup: 'fGridDDGroup',
        notifyDrop: function(ddSource, e, data){
          var records = ddSource.dragData.selections;
          Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
          fGrid.store.add(records);
          fGrid.store.sort('username', 'ASC');
          return true;
        }
      });
      var pGridDropTargetEl = pGrid.getView().scroller.dom;
      var pGridDropTarget = new Ext.dd.DropTarget(pGridDropTargetEl, {
              ddGroup    : 'pGridDDGroup',
              notifyDrop : function(ddSource, e, data){
                      var records =  ddSource.dragData.selections;
                      Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                      pGrid.store.add(records);
                      pGrid.store.sort('username', 'ASC');
                      return true
              }
      });
    },
    
    doUpdateLayout: function(combo, record, index) {
      Ext.getCmp('fGrid').setVisible(record.get('ptid') == 2);
      Ext.getCmp('pGrid').setVisible(record.get('ptid') == 2);
    },
    
    onSave: function() {
      var fGrid = Ext.getCmp('fGrid');
      var pGrid = Ext.getCmp('pGrid');
      var ptid = Ext.getCmp('ptCombo').getValue();
      this.fireEvent('save', ptid, pGrid.store);
      fGrid.store.removeAll();
      fGrid.store.commitChanges();
      
      this.close();
    },
    
    onClose: function() {
      this.close();
    }
});
