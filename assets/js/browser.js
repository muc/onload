
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  Ext.grid.RowSelectionModel.override ({
    getSelectedIndex : function(){
      return this.grid.store.indexOf( this.selections.itemAt(0) );
    }
  });
  
  var FileRec = new Ext.data.Record.create([
    {name: 'fid', type: 'int'},
    {name: 'name'},
    {name: 'parent', type: 'int'},
    {name: 'description'},
    {name: 'tags'},
    {name: 'size'},
    {name: 'perm'},
    {name: 'type'},
    {name: 'icon'},
    {name: 'folders'},
    {name: 'files'}
  ]);
  
  var bEdit = false;
  var bNew = false;
  var bNewIdx = 0;
  var curFid = 0;
  var curFolder = new FileRec({
    fid: 0,
    parent: 0,
    name: 'root',
    type: 'folder'
  });
  var breadCrumbObj = new Array(
    {
      name: 'Home',
      fid: 0,
      parent: 0,
      icon: 'home.png'
    }
  );
  
  var filesStore = new Ext.data.Store({
    autoLoad: true,
    reader: new Ext.data.JsonReader({
      totalProperty: 'total',
      root: 'data',
      idProperty: 'fid',
      successProperty: 'success',
    }, FileRec),
    proxy: new Ext.data.HttpProxy({
      api: {
          read : 'browser/get_dir',
          create : 'browser/create_dir',
          update: 'browser/update_dir',
          destroy: 'browser/delete_dir'
      },
      //url: 'browser/get_dir',
      method: 'POST',
    }),
    writer: new Ext.data.JsonWriter({
      encode: true,
    }),
    autoSave: true,
    baseParams: {fid: curFolder.fid},
    listeners: {
      load: function(s, records) {
        if (curFolder.get('fid') > 0) {
          insertUpFolder(curFolder.get('parent'));
        }
      },
      beforewrite: function(store, action, record, options, arg) {
        if (bNew) {
          return false;
        }
        if (action == 'create') {
          if (record.constructor != Array) {
            if (record.get('type') == 'parent') {
              record.modified['name'] = undefined;
              record.modified['fid'] = undefined;
              record.modified['parent'] = undefined;
              record.modified['type'] = undefined;
              return false;
            }
          }
          else {
            for (var i = 0; i < record.length; i++) {
              if (record[i].get('type') == 'parent') {
                record.splice(i, 1);
                break;
              }
            }
          }
        }
      },
    }
  });
  
  function insertUpFolder(fid) {
    Ext.Ajax.request({
      url: 'browser/get_folder',
      method: 'post',
      params: {fid: fid},
      success: function(result, request) {
        var data = Ext.util.JSON.decode(result.responseText);
        filesStore.insert(0, new FileRec({
          name: '.. übergeordneter Ordner',
          type: 'parent',
          fid: data.fid,
          parent: data.parent,
        }));
      }
    });
  }
  
  var permissionTypeStore = new Ext.data.ArrayStore({
    fields: [
      'pid',
      'perm'
    ],
    data: [
      [1, 'public'],
      [2, 'shared'],
      [3, 'private'],
    ]
  });
  
  var sm = new Ext.grid.CheckboxSelectionModel({
    renderer: function(value, meta, record, rowIndex, colIndex, store) {
      if (record.get('type') != 'parent') {
        return '<div class="x-grid3-row-checker">&#160;</div>';
      }
    },
    listeners: {
      selectionchange: function() {
        if (filesStore.getCount() > 0 && filesStore.getAt(0).get('type') == 'parent' && this.isSelected(0)) {
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
      
      var folders_info = record.get('folders') + (record.get('folders') > 0 ? ' folders' : ' folder');
      var files_info = record.get('files') + (record.get('files') > 0 ? ' files' : ' file');
      var sub_info = (record.get('folders') == 0 && record.get('files') == 0) ?
          'empty' :
          (record.get('folders') > 0 && record.get('files') > 0) ?
              folders_info + ', ' + files_info :
              record.get('folders') > 0 ? folders_info : files_info;
      
      return ' <div class="folder-link">' 
            + img 
            + ' ' + value + '&nbsp;&nbsp;&nbsp;' 
            + ' <span style="color:#bbb;">' + sub_info + '</span></div>';
    }
    else if (record.get('type') == 'parent') {
      return '<a href="#" style="color:#bbb;">' + value + '</a>';
    }
    else {
      return value;
    }
  }
  var editor = new Ext.ux.grid.RowEditor({
    saveText: 'Save',
    clicksToEdit: 2,
    listeners: {
      beforeedit: function() { return bEdit; },
      saveclicked: function() { bEdit = false; },
      afteredit: function() { 
        bEdit = false; 
        console.info('a');
      },
      validateedit: function(roweditor, obj, record, rowIndex) {
        console.info('v');
        bEdit = false; 
        bNew = false;
      },
      canceledit: function() { 
        bEdit = false;
        if (bNew) {
          bNew = false;
          filesStore.removeAt(bNewIdx);
          browserGrid.getView().refresh();
        }
      },
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
  
  
  var browserGrid = new BrowserGrid({
    store: filesStore,
    plugins: [editor],
    cm: new Ext.grid.ColumnModel({
      defaults: {
        sortable: false,
        menuDisabled: true
      },
      columns: [
        sm,
        {id: 'name', header: 'Name', width: 200, dataIndex: 'name', renderer: renderName, editor: {xtype: 'textfield',allowBlank: false}},
        {id: 'description', header: 'Description', dataIndex: 'description', editor: {xtype: 'textfield'}},
        {header: 'Tags', width: 200, dataIndex: 'tags', editor: {xtype: 'textfield'}},
        {header: 'Size', width: 100, dataIndex: 'size', editable: false},
        {header: 'Perm', width: 50, dataIndex: 'perm', editor: {xtype: 'combo'}},
      ]
    }),
    sm: sm,
    listeners: {
      rowdblclick: function(grid, rowIndex, e) {
        var record = filesStore.getAt(rowIndex);
        if (record.get('type') == 'folder' || record.get('type') == 'parent') {
          changeDir(record);
        }
      },
      validateedit: function(e) {
        console.log(e);
      }
    }
  });
  
  
  function changeDir(dir, n) {
    curFolder = dir;
    filesStore.setBaseParam('fid', dir.get('fid'));
    filesStore.load();
    if (n >= 0) {
      n++;
      if (breadCrumbObj.length > (n)) {
        breadCrumbObj.splice(n, breadCrumbObj.length - n);
      }
    }
    else {
      if (dir.get('type') == 'folder') {
        breadCrumbObj.push({
          name  : dir.get('name'),
          fid   : dir.get('fid'),
          parent: dir.get('parent'),
          icon  : 'folder.gif'
        });
      }
      if (dir.get('type') == 'parent') {
        breadCrumbObj.pop();
      }
    }
    buildBreadCrumb();
  }
  
  function buildBreadCrumb() {
    breadCrumb.removeAll();
    var bcPath = new Array();
    Ext.each(breadCrumbObj, function(item) {
      var bc_class = ' class="bc-folder"';
      var bc_id = ' id="bc-folder-link-'+ item.fid + '"';
      var bc_img_id = ' id="bc-folder-img-'+ item.fid + '"';
      
      bcPath.push('<a' + bc_id + bc_class +' href="#"><img' + bc_img_id + ' src="assets/img/' + item.icon + '"/> ' + item.name + '</a>');
    });
    breadCrumb.add({
      xtype: 'tbtext',
      text: bcPath.join(' &raquo; '),
    });
    breadCrumb.doLayout();
    
    Ext.select('a.bc-folder').on('click', function(e, t, o) {
      var id = e.getTarget('', 1, true).id.split('-')[3];
      var n = 0;
      Ext.each(breadCrumbObj, function(item) {
        if (item && item.fid == id) {
          changeDir(new FileRec({
            name: item.name,
            fid: item.fid,
            parent: item.parent,
            type: 'folder'
          }), n);
          return;
        }
        n++;
      });
    });
  }
  
  browserGrid.on('onEdit', function() {
    bEdit = true;
    editor.startEditing(browserGrid.getSelectionModel().getSelectedIndex(), true);
  });
  
  browserGrid.on('onNew', function() {
    bEdit = true;
    bNew = true;
    var f = new FileRec({
      name: 'new Folder',
      type: 'folder',
      parent: curFolder.get('fid'),
      icon: 'folder-icon',
      folders: 0,
      files: 0
    });
    editor.stopEditing();
    bNewIdx = curFolder.get('fid') > 0 ? 1 : 0;
    
    filesStore.insert(bNewIdx, f);
    browserGrid.getView().refresh();
    browserGrid.getSelectionModel().selectRow(bNewIdx);
    editor.startEditing(bNewIdx);
  });
  
  browserGrid.on('onDelete', function() {
    
    Ext.Msg.confirm('Delete', 'Are you sure to delete selected folders and files?', function(btn) {
      if (btn == 'yes') {
        var records = browserGrid.getSelectionModel().getSelections();
        filesStore.remove(records);
      }
    });
    
  });
  
  var breadCrumb = new Ext.Toolbar({
    id: 'breadCrumb',
    renderTo: browserGrid.tbar,
    defaultType: 'tbtext',
  });
  
  buildBreadCrumb();

});