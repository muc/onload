
BrowserGrid = Ext.extend(Ext.grid.GridPanel, {
  id: 'browserGrid',
  title: 'Files (sample data)',
  renderTo: 'content-panel',
  loadMask: true,
  autoExpandColumn: 'descr',
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
    BrowserGrid.superclass.initComponent.call(this);
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
        tyle: 'margin-right: 5px;', 
        disabled: true, 
        scope: this
      },
      { 
        ref: '../editBtn', 
        text: 'Edit', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        disabled: true, 
        scope: this
      },
      { 
        ref: '../deleteBtn', 
        text: 'Delete', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
        disabled: true, 
        scope: this
      },
      '->',
      { 
        ref: '../reloadBtn', 
        text: 'Reload', 
        minWidth: 70, 
        style: 'margin-right: 5px;', 
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
  
  onReload: function() {
    this.getStore().load();
  }
});
