Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  
  var User = Ext.data.Record.create([
    {name: 'id', type: 'int'},
    {name: 'username'},
    {name: 'password'},
    {name: 'email'},
    {name: 'admin'},
  ]);
  
  var userStore = new Ext.data.Store({
    id: 'userStore',
    //restful: true,
    remoteSort: true,
    reader: new Ext.data.JsonReader({
      totalProperty: 'total',
      successProperty: 'success',
      idProperty: 'id',
      messageProperty: 'message',
      root: 'data',
    }, User),
    proxy: new Ext.data.HttpProxy({
      api: {
          read : 'ajax/users/view',
          create : 'ajax/users/create',
          update: 'ajax/users/update',
          destroy: 'ajax/users/destroy'
      },
      //url: 'ajax/users',
      method: 'POST'
    }),
    writer: new Ext.data.JsonWriter({
      encode: true
    }),
    autoSave: true
  });
  
  userStore.setDefaultSort('id', 'asc');
  
  function renderIsAdmin(value, meta, record, rowIndex, colIndex, store) {
    return value ? '<img src="assets/img/tick.png" width="10px" height="10px"/>' : '<img src="assets/img/cross.png" width="10px" height="10px"/>';
  }
  
  var lastSelection = [];
  var formEditMode = true;
  var curRecord = null;
  
  function doReloadUserGrid() {
    var sb = Ext.getCmp('adminStatusBar');
    userStore.load({
      params:{start:0, limit:15},
      callback: function(records, options, success){
        if (!success) {
          sb.setStatus('Authentication failed.');
        }
        if (userStore.getTotalCount() > 0 && !adminGrid.getSelectionModel().hasSelection()) {
          adminGrid.getSelectionModel().selectFirstRow();
        }
      }
    });
  }
  
  function addUser() {
    formEditMode = false;
    lastSelection = adminGrid.getSelectionModel().getSelections();
    adminGrid.getSelectionModel().clearSelections();
    adminGrid.setDisabled(true);
    userForm.getForm().reset();
    setUserFormDisabled(false);
    userForm.usernameField.focus();
  }
  
  function editUser() {
    formEditMode = true;
    lastSelection = adminGrid.getSelectionModel().getSelections();
    adminGrid.setDisabled(true);
    setUserFormDisabled(false);
    userForm.usernameField.focus(true);
  }
  
  function delUser() {
    userStore.remove(adminGrid.getSelectionModel().getSelections());
    adminGrid.getView().refresh();
  }
  
  
  function setUserFormDisabled(disable) {
    userForm.usernameField.setDisabled(disable);
    userForm.emailField.setDisabled(disable);
    userForm.passwordField.setDisabled(disable);
    userForm.adminField.setDisabled(disable);
    if (disable) {
      userForm.saveBtn.hide();
      userForm.cancelBtn.hide();
    }
    else {
      userForm.saveBtn.show();
      userForm.cancelBtn.show();
    }
  }
  
  var editor = new Ext.ux.grid.RowEditor({
    saveText: 'Save',
    listeners: {
      move: function(p){ this.resize(); },
      hide: function(p){
        var mainBody = this.grid.getView().mainBody;
        var lastRow = Ext.fly(this.grid.getView().getRow(this.grid.getStore().getCount()-1));
        mainBody.setHeight(lastRow.getBottom() - mainBody.getTop(),{
          callback: function(){ mainBody.setHeight('auto'); }
        });
      },
      afterlayout: function(container, layout) { this.resize(); }
    },
    resize: function() {
      var row = Ext.fly(this.grid.getView().getRow(this.rowIndex)).getBottom();
      var lastRow = Ext.fly(this.grid.getView().getRow(this.grid.getStore().getCount()-1)).getBottom();
      var mainBody = this.grid.getView().mainBody;
      var h = Ext.max([row + this.btns.getHeight() + 10, lastRow]) - mainBody.getTop();
      mainBody.setHeight(h,true);
    }
  });
  
  var adminGrid = new Ext.grid.GridPanel({
    id: 'adminGrid',
    frame: false,
    border: false,
    columnWidth: 1,
    autoHeight: true,
    loadMask: true,
    plugins: [editor],
    store: userStore,
    cm: new Ext.grid.ColumnModel({
      defaults: {
        sortable: true,
        menuDisabled: true
      },
      columns: [{
          header: 'id', 
          width: 30, 
          dataIndex: 'id'
        }, {
          header: 'Username', 
          width: 200, 
          dataIndex: 'username',
          editor: {
            xtype: 'textfield',
            allowBlank: false
          }
        }, {
          id: 'email', 
          header: 'E-Mail', 
          dataIndex: 'email',
          editor: {
            xtype: 'textfield',
            allowBlank: false,
            vtype: 'email'
          } 
        }, {
          header: 'Admin', 
          width: 50, 
          align: 'center',
          dataIndex: 'admin',
          renderer: renderIsAdmin,
          editor: {
            xtype: 'checkbox'
          }
        }
      ],
    }),
    sm: new Ext.grid.RowSelectionModel({
      singleSelect: false,
      listeners: {
        rowselect: function(sm, row, rec) {
          curRecord = rec;
          userForm.getForm().loadRecord(rec);
        }
      }
    }),
    autoExpandColumn: 'email',
    columnLines: true,
    bbar: new Ext.PagingToolbar({
      pageSize: 15,
      store: userStore,
      displayInfo: true,
      displayMsg: '{2} Users found',
      emptyMsg: "No Users found",
    })
  });
  
  var userForm = new UserForm({
    id: 'userForm',
  });
  
  var adminPanel = new Ext.Panel({
    title: 'Admin Users',
    id: 'adminPanel',
    iconCls: 'user-panel-icon',
    layout: 'column',
    border: false,
    frame: true,
    autoHeight: true,
    width: 940,
    renderTo: 'content-panel',
    items: [adminGrid, userForm],
    tbar: [
      { text: 'Add', minWidth: 70, style: 'margin-right: 5px;', iconCls: 'add-icon', handler: addUser},
      { ref: '../editBtn', text: 'Edit', minWidth: 70, style: 'margin-right: 5px;', iconCls: 'edit-icon', disabled: true, handler: editUser},
      { ref: '../deleteBtn', text: 'Delete', minWidth: 70, style: 'margin-right: 5px;', iconCls: 'delete-icon', disabled: true, handler: delUser},
      '->',
      { text: 'Reload', minWidth: 70, style: 'margin-right: 5px;', iconCls: 'reload-icon', handler: doReloadUserGrid},
    ],
    bbar: new Ext.ux.StatusBar({
      id: 'adminStatusBar',
      defaultText: 'Ready'
    })
    
  });
  
  adminGrid.getSelectionModel().on('selectionchange', function(sm){
    adminPanel.editBtn.setDisabled(sm.getCount() != 1);
    adminPanel.deleteBtn.setDisabled(sm.getCount() < 1);
  });
  
  userForm.saveBtn.on('click', function() {
    var values = userForm.getForm().getValues();
    if (formEditMode) {
      userForm.getForm().updateRecord(curRecord);
    }
    else {
      userStore.add(new userStore.recordType(userForm.getForm().getValues()));
      doReloadUserGrid();
    }
    setUserFormDisabled(true);
    adminGrid.setDisabled(false);
    //adminGrid.getView().refresh();
    adminGrid.getSelectionModel().selectRecords(lastSelection);
  });
  
  userForm.cancelBtn.on('click', function() {
    setUserFormDisabled(true);
    adminGrid.setDisabled(false);
    adminGrid.getSelectionModel().selectRecords(lastSelection);
  });
  
  /*
   * Event when logout is clicked
   * redirect to /logout with animations
   */
  Ext.get('a-logout').on('click', function() {
    Ext.select('header').slideOut('r');
    Ext.select('nav').slideOut('l', {callback: function() {
      Ext.get('content-panel').switchOff({
        duration: 0.3,
        callback: function() {
          window.location = 'logout';
        }
      });
    }});
  });
  
  doReloadUserGrid();
});