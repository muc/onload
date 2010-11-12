
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  var FileRec = new Ext.data.Record.create([
    {name: 'id', type: 'int'},
    {name: 'name'},
    {name: 'parent', type: 'int'},
    {name: 'descr'},
    {name: 'tags'},
    {name: 'size'},
    {name: 'perm'},
    {name: 'type'},
    {name: 'icon'},
    {name: 'files'}
  ]);
  
  var filesStore = new Ext.data.Store({
    reader: new Ext.data.JsonReader({
      total: 'total',
      root: 'data'
    }, FileRec),
    proxy: new Ext.data.HttpProxy({
      url: 'browser/get_dir',
      method: 'POST'
    }),
    autoLoad: true,
    listeners: {
      load: function(s, records) {
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
      var img = '<img src="assets/img/folder.gif"/>';
      return ' <div class="folder-link">' + img + value + '&nbsp;&nbsp;&nbsp;<span style="color:#bbb;">' + record.get('files') + ' Dateien</span></div>';
    }
    else if (record.get('type') == 'parent') {
      return '<a href="#" style="color:#bbb;">' + value + '</a>';
    }
    else {
      return value;
    }
  }
  
  var browserGrid = new BrowserGrid({
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
    listeners: {
      rowdblclick: function(grid, rowIndex, e) {
        var record = filesStore.getAt(rowIndex);
        if (record.get('type') == 'folder' || record.get('type') == 'parent') {
          filesStore.load({params: {fid: record.get('id')}});
        }
      }
    }
  });
  
  var breadCrumb = new Ext.Toolbar({
    renderTo: browserGrid.tbar,
    items: [
      '<a href="#">Home</a> » Subfolder'
    ]
  });

});