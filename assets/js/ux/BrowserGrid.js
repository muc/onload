
BrowserGrid = Ext.extend(Ext.grid.GridPanel, {
  id: 'browserGrid',
  title: 'File Browser',
  renderTo: 'content-panel',
  loadMask: true,
  autoExpandColumn: 'description',
  columnLines: true,
  width:940,
  autoHeight: true,
  frame:true,
  
  /**
   * initComponent
   * @protected
   */
  initComponent: function() {
    this.tbar = this.buildToolBar();
    this.bbar = this.buildStatusBar();
    this.addEvents(
      'onNew',
      'onEdit',
      'onDelete',
      'onDownload',
      'onPermission',
      'onUpload'
    );
    BrowserGrid.superclass.initComponent.call(this);
  },
  buildToolBar: function() {
    return [
      { 
        ref: '../uploadBtn', 
        text: 'Upload', 
        minWidth: 70, 
        style: 'margin-right: 5px;',
        iconCls: 'upload-icon',
        plugins: [
          new BrowsePlugin({
            multiple: true,
            dropEl: Ext.get('content-panel'),
            enableFileDrop: true,
            inputFileName: 'file',
          }) 
        ],
        scope: this,
        handler : this.onFilesSelect
      },
      '-',
      { 
        ref: '../downloadBtn', 
        text: 'Download', 
        minWidth: 70,
        tyle: 'margin-right: 5px;', 
        disabled: true, 
        iconCls: 'download-icon',
        handler: this.onDownload,
        scope: this
      },
      {
        xtype: 'tbseparator',
        ref: '../newBtnSep',
        id: 'newBtnSep'
      },
      { 
        ref: '../newBtn', 
        text: 'new Folder', 
        minWidth: 70, 
        style: 'margin-right: 5px;',
        iconCls: 'folder-add-icon',
        handler: this.onNew,
        scope: this
      },
      {
        xtype: 'tbseparator',
        ref: '../editBtnSep',
        id: 'editBtnSep'
      },
      { 
        ref: '../editBtn', 
        text: 'Edit', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        disabled: true, 
        iconCls: 'edit-icon',
        handler: this.onEdit,
        scope: this
      },
      {
        xtype: 'tbseparator',
        ref: '../permBtnSep', 
        id: 'permBtnSep'
      },
      { 
        ref: '../permBtn', 
        text: 'Folder Permission', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        disabled: true,
        iconCls: 'folder-perm-icon',
        scope: this, 
        handler: this.onPermission
      },
      {
        xtype: 'tbseparator',
        ref: '../deleteBtnSep',
        id: 'deleteBtnSep'
      },
      { 
        ref: '../deleteBtn', 
        text: 'Delete', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'delete-icon',
        disabled: true, 
        handler: this.onDelete,
        scope: this
      },
      '->',
      { 
        ref: '../reloadBtn', 
        text: 'Reload', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'reload-icon',
        scope: this, 
        handler: this.onReload
      },
    ];
  },
  
  buildStatusBar: function() {
    return new Ext.ux.StatusBar({
      id: 'browserStatusBar',
      defaultText: 'Ready'
    });
  },
  
  onNew: function() {
    this.fireEvent('onNew');
  },
  
  onEdit: function() {
    this.fireEvent('onEdit');
  },
  
  onDelete: function() {
    this.fireEvent('onDelete');
  },
  
  onDownload: function() {
    this.fireEvent('onDownload');
  },
  
  onPermission: function() {
    this.fireEvent('onPermission');
  },
  
  onReload: function() {
    this.getStore().load();
  },
  
  onFilesSelect: function(fileSelector, e) {
    this.fireEvent('doUpload', fileSelector);
  }
});
