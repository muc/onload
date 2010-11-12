
BrowserPanel = Ext.extend(Ext.Panel, {
  id: 'browserPanel',
  title: 'Files (sample data)',
  iconCls: 'home-icon',
  frame: true,
  border: false,
  width: 940,
  autoHeight: true,
  
  /**
   * initComponent
   * @protected
   */
  initComponent: function() {
    this.tbar = this.buildToolBar();
    this.bbar = this.buildBottomBar();
    BrowserPanel.superclass.initComponent.call(this);
  },
  
  buildToolBar: function() {
    return [
      { 
        ref: '../uploadBtn', 
        text: 'Upload', 
        minWidth: 70, 
        style: 'margin-right: 5px;',
        scope: this
      },
      { 
        ref: '../downloadBtn', 
        text: 'Download', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: '', 
        disabled: true,
        scope: this
      },
      { 
        ref: '../newBtn', 
        text: 'new Folder', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'folder-add-icon',
        scope: this
      },
      { 
        ref: '../editBtn', 
        text: 'Edit', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'edit-icon', 
        disabled: true,
        scope: this
      },
      { 
        ref: '../deleteBtn', 
        text: 'Delete', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'delete-icon', 
        disabled: true,
        scope: this
      },
      '->',
      {
        ref: '../testBtn',
        text: 'Test',
        scope: this
      },
      { 
        ref: '../reloadBtn',
        text: 'Reload', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        iconCls: 'reload-icon',
        scope: this
      }
    ];
  },
  
  buildBottomBar: function() {
    return new Ext.ux.StatusBar({
      id: 'browserStatusBar',
      defaultText: 'Ready'
    });
  },
  
});
