
var pTypeStore = new Ext.data.JsonStore({
  root: 'data',
  proxy: new Ext.data.HttpProxy({
    url: 'permissions/permtype',
    method: 'POST',
  }),
  fields: [
    {name: 'ptid', type: 'int'},
    {name: 'name'},
  ],
  storeId: 'pTypeStore',
  autoLoad: true
});

var pfStore = new Ext.data.JsonStore({
  reader: new Ext.data.JsonReader({
    totalProperty: 'total',
    root: 'data',
    idProperty: 'uid',
    successProperty: 'success',
  }),
  fields: [
    {name: 'uid', type: 'int'},
    {name: 'username'},
    {name: 'upload'},
  ],
  proxy: new Ext.data.HttpProxy({
    url: 'permissions/fusers',
    method: 'POST',
  }),
  root: 'data',
  storeId: 'pfStore',
  autoSave: false,
  autoLoad: false,
});

var ppStore = new Ext.data.JsonStore({
  reader: new Ext.data.JsonReader({
    totalProperty: 'total',
    root: 'data',
    idProperty: 'uid',
    successProperty: 'success',
  }),
  fields: [
    {name: 'uid', type: 'int'},
    {name: 'username'},
    {name: 'upload'},
  ],
  proxy: new Ext.data.HttpProxy({
    url: 'permissions/pusers',
    method: 'POST',
  }),
  root: 'data',
  storeId: 'ppStore',
  autoSave: false,
  autoLoad: false,
  listeners: {
    update: function(store, record, operation) {
      console.log(operation);
      record.modified['upload'] = undefined;
    }
  }
});