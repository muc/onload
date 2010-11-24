/**
 * The browser grid frontend
 */

Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  /**
   * add a new function to the RowSelectionModel to get the selected index
   */
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
    {name: 'files'},
    {name: 'upload'}
  ]);
  
  
  /**
   * local variables 
   */
  var bEdit = false;
  var bNew = false;
  var bNewIdx = 0;
  var curFid = 0;
  var isAdmin = typeof(_isAdmin) != 'undefined';
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
      icon: 'bc-home'
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
          update: 'browser/update',
          destroy: 'browser/delete'
      },
      //url: 'browser/get_dir',
      method: 'POST',
    }),
    writer: new Ext.data.JsonWriter({
      encode: true,
    }),
    autoSave: true,
    baseParams: { fid: curFolder.fid },
    listeners: {
      load: function(s, records) {
        // insert the "to parent folder" to the grid 
        if (curFolder.get('fid') > 0) {
          insertUpFolder(curFolder.get('parent'));
        }
      },
      beforewrite: function(store, action, record, options, arg) {
        // all stuff here is to prevent the store to create a new folder for the "to parent folder link"
        if (bNew) {
          return false;
        }
        if (action == 'create') {
          if (record.constructor != Array) {
            // remove the dirty flag in grid
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
  
  /**
   * Insert the "to parent folder" to the grid
   */
  function insertUpFolder(fid) {
    Ext.Ajax.request({
      url: 'browser/get_folder',
      method: 'post',
      params: {fid: fid},
      success: function(result, request) {
        var data = Ext.util.JSON.decode(result.responseText);
        filesStore.insert(0, new FileRec({
          name: 'parent folder',
          type: 'parent',
          fid: data.fid,
          parent: data.parent,
        }));
      }
    });
  }
  
  /**
   * Checkbox selection model for the grid
   */
  var sm = new Ext.grid.CheckboxSelectionModel({
    renderer: function(value, meta, record, rowIndex, colIndex, store) {
      // only show the checkbox, if the folder isnt the "to parent folder" link
      if (record.get('type') != 'parent') {
        return '<div class="x-grid3-row-checker">&#160;</div>';
      }
    },
    listeners: {
      selectionchange: function() {
        // update toolbar buttons visibility, when grid selection change
        if (filesStore.getCount() > 0 && filesStore.getAt(0).get('type') == 'parent' && this.isSelected(0)) {
          this.deselectRow(0);
        }
        
        var isFolder = this.hasSelection() ?
          (this.getSelected().get('type') == 'folder' ? true : false) : false;
          
        browserGrid.downloadBtn.setDisabled(this.getCount() < 1);
        browserGrid.editBtn.setDisabled(this.getCount() != 1);
        browserGrid.deleteBtn.setDisabled(this.getCount() < 1);
        browserGrid.permBtn.setDisabled(isFolder ? (this.getCount() != 1 ? true : false) : true);
      }
    }
  });
  
  /**
   * Renderer for grid column 'Name'
   * Add icon and folder information, instead of the name only
   */
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
            + ' ' + value + '&nbsp;&nbsp;&nbsp;' 
            + ' <span style="color:#bbb;">' + sub_info + '</span></div>';
    }
    else if (record.get('type') == 'parent') {
      return '<div class="folder-up-link">' + value + '</div>';
    }
    else if (record.get('type') == 'file'){
      return '<div class="' + record.get('icon') + '">' + value + '</div>';
    }
  }
  
  /**
   * Renderer for grid column 'Permission'
   * Show an icon instead of the name
   */
  function renderPermission(value, meta, record, rowIndex, colIndex, store) {
    if (value == 1) {
      return '<img src="assets/img/private.png"/>';
    }
    if (value == 2) {
      return '<img src="assets/img/group.png"/>';
    }
    if (value == 3) {
      return '<img src="assets/img/public.png"/>';
    }
  }
  
  /**
   * Grid editor for inline editing
   */
  var editor = new Ext.ux.grid.RowEditor({
    saveText: 'Save',
    clicksToEdit: 2,
    listeners: {
      beforeedit: function() { return bEdit; },
      saveclicked: function() { bEdit = false; },
      afteredit: function() { 
        bEdit = false; 
      },
      validateedit: function(roweditor, obj, record, rowIndex) {
        bEdit = false; 
        bNew = false;
      },
      canceledit: function() { 
        bEdit = false;
        if (bNew) {
          // remove the created folder, if cancel is clicked
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
    // fix for inline editing, if it's the last row
    resize: function() {
      var row = Ext.fly(this.grid.getView().getRow(this.rowIndex)).getBottom();
      var lastRow = Ext.fly(this.grid.getView().getRow(this.grid.getStore().getCount()-1)).getBottom();
      var mainBody = this.grid.getView().mainBody;
      var h = Ext.max([row + this.btns.getHeight() + 10, lastRow]) - mainBody.getTop();
      mainBody.setHeight(h,true);
    }
  });
  
  /*
   * create the browser grid panel
   */
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
        {id: 'name', header: 'Name', width: 250, dataIndex: 'name', renderer: renderName, editor: {xtype: 'textfield',allowBlank: false}},
        {id: 'description', header: 'Description', dataIndex: 'description', editor: {xtype: 'textfield'}},
        //{header: 'Tags', width: 200, dataIndex: 'tags', editor: {xtype: 'textfield'}},
        {header: 'Size', width: 100, dataIndex: 'size', editable: false},
        {header: 'Perm', width: 50, dataIndex: 'perm', renderer: renderPermission, editable: false},
      ]
    }),
    sm: sm,
    listeners: {
      rowdblclick: function(grid, rowIndex, e) {
        // change directory on double click
        var record = filesStore.getAt(rowIndex);
        if (record.get('type') == 'folder' || record.get('type') == 'parent') {
          changeDir(record);
        }
      }
    }
  });
  
  /**
   * Handles the change directory action
   */
  function changeDir(dir, n) {
    curFolder = dir;
    
    // set upload button visibility, dependent on user permission
    browserGrid.uploadBtn.setDisabled(
      curFolder.get('fid') == 0 
      ? false
      : curFolder.get('upload') ? false : true
    );
    filesStore.setBaseParam('fid', dir.get('fid'));
    filesStore.load();
    
    // update the breadcrumb, and check if it was a grid double click or a breadcrumb click
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
          icon  : 'bc-folder'
        });
      }
      if (dir.get('type') == 'parent') {
        breadCrumbObj.pop();
      }
    }
    buildBreadCrumb();
  }
  
  
  /**
   * function, that updates the breadcrumb
   */
  function buildBreadCrumb() {
    breadCrumb.removeAll();
    var bcPath = new Array();
    Ext.each(breadCrumbObj, function(item) {
      var bc_class = ' class=' + item.icon;
      var bc_id = ' id="bc-folder-link-'+ item.fid + '"';
      var bc_img_id = ' id="bc-folder-img-'+ item.fid + '"';
      
      bcPath.push('<a' + bc_id + bc_class +' href="#">' + item.name + '</a>');
    });
    breadCrumb.add({
      xtype: 'tbtext',
      text: bcPath.join(' &raquo; '),
    });
    breadCrumb.doLayout();
    
    // event handler for 'Home' link click in breadcrumb
    Ext.select('a.bc-home').on('click', function(e, t, o) {
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
    // event handler for folder link click in breadcrumb
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
  
  /*
   * click event handler for edit button
   */
  browserGrid.on('onEdit', function() {
    bEdit = true;
    editor.startEditing(browserGrid.getSelectionModel().getSelectedIndex(), true);
  });
  
  /*
   * click event handler for new folder button
   */
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
    // insert a new folder to grid
    bNewIdx = curFolder.get('fid') > 0 ? 1 : 0;
    filesStore.insert(bNewIdx, f);
    browserGrid.getView().refresh();
    browserGrid.getSelectionModel().selectRow(bNewIdx);
    // and start edit mode
    editor.startEditing(bNewIdx);
  });
  
  /*
   * click event handler for delete button
   */
  browserGrid.on('onDelete', function() {
    var records = browserGrid.getSelectionModel().getSelections();
    var bNotEmtpy = false;
    
    // check, if selected folder has files or subfolders
    Ext.each(records, function(rec) {
      if (rec.get('files') > 0 || rec.get('folders') > 0) {
        bNotEmtpy = true;
      }
    });
    
    // only emtpy folders can be deleted
    if (bNotEmtpy) {
      Ext.Msg.show({
        title: 'Deletion not possible',
        msg: 'You can not delete folders that are not empty!',
        buttons: Ext.Msg.OK,
        icon: Ext.Msg.WARNING
      });
    }
    else {
      Ext.Msg.confirm('Delete', 'Are you sure to delete selected folders and files?', function(btn) {
        if (btn == 'yes') {
          // remove selected files/folders from the store
          filesStore.remove(records);
          filesStore.reload();
        }
      });
    }
  });
  
  /*
   * click event handler for download button
   */
  browserGrid.on('onDownload', function() {
    var records = browserGrid.getSelectionModel().getSelections();
    var data = null;
    
    // check how many files/folders are selected
    if (records.length == 1) {
      var record = records[0];
      data = {
        fid: record.get('fid'), 
        type: record.get('type'),
        parent: record.get('parent')
      };
    }
    else if (records.length > 1) {
      data = new Array();
      Ext.each(records, function(record) {
        data.push({
          fid: record.get('fid'), 
          type: record.get('type'),
          parent: record.get('parent')
        });
      });
    }
    
    // update the html form and submit it
    Ext.get('count').dom.value = records.length;
    Ext.get('data').dom.value = Ext.util.JSON.encode(data);
    $('#dlform').submit();
  });
  
  
  /*
   * click event handler for folder permission button
   */ 
  browserGrid.on('onPermission', function() {
    var selFolder = browserGrid.getSelectionModel().getSelected();
    
    // create the permission window
    var pw = new PermissionWin({
      title: 'Permission for folder \'' + selFolder.get('name') + '\''
    });
    pw.loadData({
      ptype: selFolder.get('perm'),
      fid: selFolder.get('fid'),
    });
    pw.show();
    
    // event handler for the save button
    pw.on('save', function(ptid, pu_store) {
      var folder = filesStore.getById(selFolder.get('fid'));
      folder.set('perm', ptid);
      
      // send new permissions to the backend
      var data = new Array();
      var jsonDataEncode = "";
      var records = pu_store.getRange();
      Ext.each(records, function(r) {
        data.push(r.data);
      });
      jsonDataEncode = Ext.util.JSON.encode(data);
      
      Ext.Ajax.request({
        url: 'permissions/update',
        method: 'post',
        params: {
          fid: selFolder.get('fid'),
          data: jsonDataEncode
        },
        success: function() {
          // cleare the store in permission window, when ajax request was successful
          pu_store.removeAll();
          pu_store.commitChanges();
        }
      });
      
    });
  });
  
  /*
   * click event handler for folder upload button
   */ 
  browserGrid.on('doUpload', function(fileSelector) {
    browserGrid.body.mask('Uploading files...');
    var files = fileSelector.getFileList();
    var counter = files.length;
    var uploader = new Uploader({
      url : '/browser/upload',
      fileSelector : fileSelector,
    });
    uploader.on('uploadfailure', function() {
      counter--;
      if (counter == 0) {
        browserGrid.body.unmask();
        Ext.Msg.alert('Upload failes');
      }
    });
    uploader.on('uploadcomplete', function() {
      counter--;
      if (counter == 0) {
        browserGrid.body.unmask();
        filesStore.reload();
      }
    });
    
    Ext.each(files, function(file) {
      uploader.upload(file);
    });
  });
  
  /*
   * Hide some toolbar buttons, if loggedin user has now admin rights
   */
  function showButtons(bShow) {
    browserGrid.newBtn.setVisible(bShow);
    browserGrid.editBtn.setVisible(bShow);
    browserGrid.permBtn.setVisible(bShow);
    browserGrid.deleteBtn.setVisible(bShow);
    browserGrid.newBtnSep.setVisible(bShow);
    browserGrid.editBtnSep.setVisible(bShow);
    browserGrid.permBtnSep.setVisible(bShow);
    browserGrid.deleteBtnSep.setVisible(bShow);
  }
  
  /* 
   * render the breadcrumb.
   */
  var breadCrumb = new Ext.Toolbar({
    id: 'breadCrumb',
    renderTo: browserGrid.tbar,
    defaultType: 'tbtext',
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
  
  /*
   * Event when 'Change Password' is clicked
   * Shows a Window with input fields for a new password.
   */
  Ext.get('a-change-pass').on('click', function() {
    var cpWin = new ChangePasswordWin();
    cpWin.show();
  });
  
  showButtons(isAdmin);
  buildBreadCrumb();

});