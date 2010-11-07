
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
  return value ? 'ja' : 'nein';
}

function doReloadUserGrid() {
  var sb = Ext.getCmp('adminStatusBar');
  Ext.getCmp('adminPanel').body.mask('Loading data...');
  userStore.load({
    params:{start:0, limit:15},
    callback: function(records, options, success){
      Ext.getCmp('adminPanel').body.unmask();
      if (!success) {
        sb.setStatus('Authentication failed.');
      }
      if (userStore.getTotalCount() > 0 && !adminGrid.getSelectionModel().hasSelection()) {
        adminGrid.getSelectionModel().selectFirstRow();
      }
    }
  });
}

var adminGrid = new Ext.grid.GridPanel({
  id: 'adminGrid',
  frame: false,
  border: false,
  columnWidth: 1,
  autoHeight: true,
  loadMask: true,
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
        dataIndex: 'username'
      }, {
        id: 'email', 
        header: 'E-Mail', 
        dataIndex: 'email' 
      }, {
        header: 'Admin', 
        width: 50, 
        dataIndex: 'admin', 
        renderer: renderIsAdmin
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
/*
var userForm = new Ext.form.FormPanel({
  id: 'userForm',
  width: 330,
  padding: 5,
  buttonAlign: 'center',
  labelWidth: 80,
  defaults: {
    anchor: '100%',
    selectOnFocus: true,
    msgTarget: 'side',
  },
  items: [
    {
      xtype: 'fieldset',
      title: 'User details',
      border: false,
      items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Username',
            name: 'username',
            width: 220,
            disabled: true,
            ref: '../usernameField'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'E-Mail',
            name: 'email',
            width: 220,
            disabled: true,
            ref: '../emailField'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Password',
            name: 'password',
            width: 220,
            disabled: true,
            ref: '../passwordField'
        },
        {
            xtype: 'checkbox',
            fieldLabel: '',
            boxLabel: 'is Admin',
            name: 'admin',
            disabled: true,
            ref: '../adminField'
        }
      ]
    }
  ],
  buttons: [
    { ref: '../saveBtn', text: 'Save', hidden: true, handler: doUserCancel},
    { ref: '../cancelBtn', text: 'Cancel', hidden: true, handler: doUserCancel},
  ]
  
});
*/

var adminPanel = new Ext.Panel({
  title: 'Admin Users',
  layout: 'column',
  border: false,
  frame: true,
  id: 'adminPanel',
  autoHeight: true,
  items: [adminGrid, userForm],
  tbar: [
    { text: 'Add', minWidth: 70, style: 'margin-right: 5px;', handler: addUser},
    { ref: '../editBtn', text: 'Edit', minWidth: 70, style: 'margin-right: 5px;', disabled: true, handler: editUser},
    { ref: '../deleteBtn', text: 'Delete', minWidth: 70, style: 'margin-right: 5px;', disabled: true, handler: delUser},
    '->',
    { text: 'Reload', minWidth: 70, style: 'margin-right: 5px;', handler: doReloadUserGrid},
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

var lastSelection = [];
var formEditMode = true;
var curRecord = null;

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

function doUserSave() {
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
  
}

function doUserCancel() {
  setUserFormDisabled(true);
  adminGrid.setDisabled(false);
  adminGrid.getSelectionModel().selectRecords(lastSelection);
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
