
var pTypeStore = new Ext.data.JsonStore({
  root: 'data',
  proxy: new Ext.data.HttpProxy({
    url: 'permission/permtype',
    method: 'POST',
  }),
  fields: [
    {name: 'ptid', type: 'int'},
    {name: 'name'},
  ],
  storeId: 'pTypeStore',
  autoLoad: true
  
/*  
  reader: new Ext.data.JsonReader({
    idProperty: 'ptid',
    successProperty: 'success',
  }),
  autoSave: false,
  */
});

var pfStore = new Ext.data.JsonStore({
  reader: new Ext.data.JsonReader({
    totalProperty: 'total',
    root: 'data',
    idProperty: 'uid',
    successProperty: 'success',
  }),
  proxy: new Ext.data.HttpProxy({
    url: 'permission/fusers',
    method: 'POST',
  }),
  storeId: 'pfStore',
  autoSave: false,
  autoLoad: true
});