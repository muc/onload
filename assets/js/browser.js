var FileRec = new Ext.data.Record.create([
  {name: 'id', type: 'int'},
  {name: 'name'},
  {name: 'descr'},
  {name: 'tags'},
  {name: 'size'},
  {name: 'perm'},
  {name: 'type'},
  {name: 'files'}
]);

var filesStore = new Ext.data.Store({
  reader: new Ext.data.JsonReader({
    total: 'total',
    root: 'data'
  }, FileRec),
  proxy: new Ext.data.HttpProxy({
    url: 'ajax/files',
    method: 'POST'
  }),
  autoLoad: true,
  listeners: {
    load: function() {
      filesStore.insert(0, new FileRec({'name': '.. übergeordneter Ordner', 'type': 'parent'}));
    }
  }
});

var sm = new Ext.grid.CheckboxSelectionModel({
  renderer: function(value, meta, record, rowIndex, colIndex, store) {
    if (record.get('type') != 'parent') {
      return '<div class="x-grid3-row-checker">&nbsp;</div>';
    }
  },
  listeners: {
    selectionchange: function() {
      if (filesStore.getAt(0).get('type') == 'parent' && this.isSelected(0)) {
        this.deselectRow(0);
      }
      browserGrid.downloadBtn.setDisabled(this.getCount() < 1);
      browserGrid.editBtn.setDisabled(this.getCount() != 1);
      browserGrid.deleteBtn.setDisabled(this.getCount() < 1);
    }
  }
});

function renderName(value, meta, record, rowIndex, colIndex, store) {
  if (record.get('type') == 'folder') {
    return '<a href="#">' + value + '</a>&nbsp;&nbsp;&nbsp;<span style="color:#bbb;">' + record.get('files') + ' Dateien</span>';
  }
  else if (record.get('type') == 'parent') {
    return '<a href="#" style="color:#bbb;">' + value + '</a>';
  }
  else {
    return value;
  }
}

function doReload() {
  Ext.getCmp('browserGrid').body.mask('Loading data...');
  filesStore.load({callback: function(){
    Ext.getCmp('browserGrid').body.unmask();
  }});
}

var browserGrid = new Ext.grid.GridPanel({
  id: 'browserGrid',
  title: 'Files (sample data)',
  store: filesStore,
  
  cm: new Ext.grid.ColumnModel({
    defaults: {
      sortable: false,
      menuDisabled: true
    },
    columns: [
      sm,
      {id: 'name', header: 'Name', width: 200, dataIndex: 'name', renderer: renderName},
      {id: 'descr', header: 'Description', dataIndex: 'descr'},
      {header: 'Tags', width: 200, dataIndex: 'tags'},
      {header: 'Size', width: 100, dataIndex: 'size'},
      {header: 'Perm', width: 50, dataIndex: 'perm'},
    ]
  }),
  sm: sm,
  autoExpandColumn: 'descr',
  columnLines: true,
  width:940,
  autoHeight: true,
  frame:true,
  tbar: [
    { text: 'Upload', minWidth: 70, style: 'margin-right: 5px;'},
    { ref: '../downloadBtn', text: 'Download', minWidth: 70, style: 'margin-right: 5px;', disabled: true},
    { ref: '../editBtn', text: 'Edit', minWidth: 70, style: 'margin-right: 5px;', disabled: true},
    { ref: '../deleteBtn', text: 'Delete', minWidth: 70, style: 'margin-right: 5px;', disabled: true},
    '->',
    { text: 'Reload', minWidth: 70, style: 'margin-right: 5px;', handler: doReload},
    
  ],
  bbar: new Ext.ux.StatusBar({
    id: 'browserStatusBar',
    defaultText: 'Statusbar'
  }),
  buttons: [{text: 'A Button', handler: function() {
    Ext.Ajax.request({
      method: 'POST',
      url: 'ajax/currentuser',
      success: function() {
        
      },
      failure: function() {
        
      }
    });
  }}],
  buttonAlign:'center',
  listeners: {
    rowdblclick: function(grid, rowIndex, e) {
      var record = filesStore.getAt(rowIndex);
      console.log('DblClicked: id:' + record.get('id') + ' » ' + record.get('name') + '(' + record.get('type') + ')');
    }
  }
});

var breadCrumb = new Ext.Toolbar({
  renderTo: browserGrid.tbar,
  items: [
    '<a href="#">Home</a> » Subfolder'
  ]
});

