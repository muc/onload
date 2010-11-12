
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  var Folder = Ext.data.Record.create([
    {name: 'id', type: 'int'},
    {name: 'name'},
    {name: 'path'},
    {name: 'parent', type: 'int'},
    {name: 'description'},
    {name: 'tags'}
  ]);

  /*
   * Initialize the create/edit folder dialog
   */
  var folderDlg = new FolderWin();
  
  /*
   * Initialize the browser tree component
   */
  var browserTree = new BrowserTree({
    dataUrl: 'browse/getall'
  });
  browserTree.root.setId(0);
  
  /*
   * Initialize the browser panel component
   */
  var browserPanel = new BrowserPanel({
    renderTo: 'content-panel',
    items: [browserTree]
  });

  var breadCrumb = new Ext.Toolbar({
    renderTo: browserPanel.tbar,
    items: [
      '<a href="#">Home</a> » Subfolder'
    ]
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
   * Event, when selection in browser tree has changed.
   * 
   * Disable/enable toolbar buttons, depending on selected nodes
   */
  browserTree.on('selectionchange', function(selModel, nodes) {
    browserPanel.downloadBtn.setDisabled(nodes.length < 1);
    browserPanel.editBtn.setDisabled(nodes.length != 1);
    browserPanel.deleteBtn.setDisabled(nodes.length < 1);
    browserPanel.newBtn.setDisabled(nodes.length > 1);
  });
  
  
  /*
   * Doubleclick event for browser tree
   */
  browserTree.on('dblc', function(node) {
  });
  
  /**
   * Click event on [Reload].
   * Reloads the browser tree
   */
  browserPanel.reloadBtn.on('click', function() {
    browserTree.getLoader().load(browserTree.root);
  });
  
  /**
   * Click event for 'delete'
   */
  browserPanel.deleteBtn.on('click', function() {
    var selection = browserTree.getSelectionModel().getSelectedNodes();
    var bChilds = false;
    Ext.each(selection, function(item, index) {
      if (item.hasChildNodes()) {
        bChilds = true;
      }
    });
    if (bChilds) {
      Ext.MessageBox.alert('Error' , "You can't delete folders, that contains subfolder!");
    }
    else {
      Ext.MessageBox.confirm('Delete Folder', 'Are you sure you want to delete selected folders?', function(btn) {
        if (btn == 'yes') {
          Ext.each(selection, function(item, index, allItems) {
            if (item.attributes.type == 'folder') {
              // delete folder
              Ext.Ajax.request({
                url: 'browse/deletefolder',
                method: 'post',
                params: {id: item.attributes.id},
              });
            }
            else {
              // delete file
            }
          });
          browserTree.getLoader().load(browserTree.root);
        }
      });
    }
  });
  
  /*
   * Click event on 'create new Folder'
   */
  browserPanel.newBtn.on('click', function() {
    var selection = browserTree.getSelectionModel().getSelectedNodes();
    var parent = null;
    
    parent = selection.length == 0 ? browserTree.getRootNode() : selection[0].attributes.type == 'folder' ? selection[0] : selection[0].parentNode;
    var parent_path = parent.attributes.path;
    var path = parent.isRoot ? '/' : parent_path + parent.text + '/';
    var parent_id = parent.isRoot ? 0 : parent.attributes.id;
    
    var rec = new Folder({
      id: null,
      name: null,
      path: path,
      parent: parent_id
    });
    
    folderDlg.loadRecord(rec);
    folderDlg.show();
  });

  
  /*
   * Click event on 'create new Folder'
   */
  browserPanel.editBtn.on('click', function() {
    var selection = browserTree.getSelectionModel().getSelectedNodes();
    var node = selection[0];
    if (node.attributes.type == 'file') {
      console.log('edit file');
      // edit file
    }
    else {
      // edit folder dialog
      var parent = selection[0].parentNode;
      var parent_path = parent.attributes.path;
      var path = parent.isRoot ? '/' : parent_path + parent.text + '/';
      var rec = new Folder({
        id: node.attributes.id,
        name: node.attributes.name,
        path: path,
        parent: node.attributes.parent
      });
      folderDlg.loadRecord(rec);
      folderDlg.show();
    }
  });

  /*
   * Event, when [ok] button in FolderWin was clicked
   */
  folderDlg.on('ok', function(formPanel, values) {
    if (values.id) {
      // edit folder
      /*
      Ext.Ajax.request({
        url: 'browse/test',
        method: 'post',
        success: function(result) {
          var jsonData = Ext.util.JSON.decode(result.responseText);
          var root = browserTree.getRootNode();
          var pnode = root.findChild('id', 11, true);
          console.log(pnode);
          browserTree.getLoader().load(pnode);
          browserTree.expandPath(pnode.getPath());
        }
      });
      */
      //var node = browserTree.root.findChild('id', 4, true);
      //console.log(node);
    }
    else {
      // create new folder
      var pnode = values.parent == 0 ? browserTree.root : browserTree.root.findChild('id', values.parent, true);
      Ext.Ajax.request({
        url: 'browse/createfolder',
        params: { 
          name: values.name,
          parent: values.parent, 
        },
        success: function(result) {
          var jsonData = Ext.util.JSON.decode(result.responseText);
          selectNode(pnode, jsonData.data.id)
        }
      });
    }
  });
  
  function selectNode(pnode, id) {
    if (pnode.isRoot) {
      browserTree.getLoader().load(browserTree.root, function() {
        browserTree.getSelectionModel().select(browserTree.root.findChild('id', id));
      });
    }
    else {
      var paths = pnode.getPath().split("/");
      browserTree.getLoader().load(browserTree.root, function() {
      var node = browserTree.root;
        for (var i = 2; i < paths.length; i++) {
          node = node.findChild('id', paths[i]);
          node.expand(false, false);
        }
        browserTree.getSelectionModel().select(node.findChild('id', id));
      });
    }
  }
  
  browserPanel.testBtn.on('click', function() {
    var selection = browserTree.getSelectionModel().getSelectedNodes();
    var pnode = selection[0].parentNode;
    console.log(pnode);
  });

});