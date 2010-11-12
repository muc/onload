
BrowserTree = Ext.extend(Ext.ux.tree.TreeGrid, {
  width: 940,
  autoHeight: true,
  enableDD: true,
  
  /**
   * initComponent
   * @protected
   */
  initComponent: function() {
    this.columns = this.buildColumns();
    this.selModel = this.buildSelectionModel();
    this.listeners = {
      'dblclick': {
        scope: this,
        fn: function(node, e) {
          this.onDblClick(node);
        }
      }
    };

    this.addEvents({
      /**
       * @event dblc
       * Fires when user doubleclicks on a node
       * @param {node} the clicked node
       */
      dblc: true,
      selectionchange: true
    });
    BrowserTree.superclass.initComponent.call(this);
  },
  
  buildColumns: function() {
    return [
      {
          header: 'Name',
          dataIndex: 'name',
          width: 250
      },{
          header: 'Description',
          dataIndex: 'path',
          width: 500,
          id: 'path'
      },{
          header: 'Size',
          width: 100,
          dataIndex: 'size',
          align: 'right',
      },{
          header: 'Perm',
          width: 50,
          dataIndex: 'perm'
      }
    ];
  },
  
  buildSelectionModel: function() {
    return new Ext.tree.MultiSelectionModel({
      listeners: {
        'selectionchange': {
          scope: this,
          fn: function(selModel, e) {
            this.onSelectionChange(selModel, e);
          }
        }
      }
    });
  },
  
  onDblClick: function(node) {
    this.fireEvent('dblc', node);
  },
  
  onSelectionChange: function(selModel, nodes) {
    this.fireEvent('selectionchange', selModel, nodes);
  }
  
  
  
});
