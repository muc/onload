
FolderWin = Ext.extend(Ext.Window, {
  title: 'New Folder',
  id: 'folderWin',
  width: 357,
  height: 215,
  frame: true,
  border: false,
  modal: true,
  closeAction: 'hide',
  
  // private A pointer to the currently loaded record
  record : null,
  
  /**
   * initComponent
   * @protected
   */
  initComponent: function() {
    this.items = this.buildForm();
    this.addEvents({
      /**
       * @event ok
       * Fires when user clicks [ok] button
       * @param {FormPanel} this
       * @param {Object} values, the Form's values object
       */
      ok : true
    });
    FolderWin.superclass.initComponent.call(this);
  },
  
  buildForm: function() {
    return [
      {
        xtype: 'form',
        title: '',
        width: 346,
        height: 188,
        padding: 10,
        frame: true,
        border: false,
        hideBorders: true,
        id: 'folderForm',
        buttons: this.buildButtons(),
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'Folder Name',
            anchor: '100%',
            name: 'name',
            id: 'name',
          },
          {
            xtype: 'hidden',
            name: 'id',
            id: 'id'
          },
          {
            xtype: 'hidden',
            name: 'parent',
            id: 'parent'
          },
          {
            xtype: 'displayfield',
            fieldLabel: 'Path',
            anchor: '100%',
            name: 'path',
            id: 'path'
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Tags',
            anchor: '100%',
            name: 'tags',
            id: 'tags'
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Description',
            anchor: '100%',
            name: 'description',
            id: 'decription'
          },
          {
            xtype: 'combo',
            fieldLabel: 'Permission',
            anchor: '100%',
            id: 'permission'
          }
        ]
      }
    ];
  },
  
  buildButtons: function() {
    return [
      {
        xtype: 'button',
        ref: '../okBtn',
        text: 'Ok',
        handler: this.onOk,
        scope: this
      },
      {
        xtype: 'button',
        ref: '../cancelBtn',
        text: 'Cancel',
        handler: this.onCancel,
        scope: this
      }
    ];
  },
  
  /**
   * loadRecord
   * @param {Record} rec
   */
  loadRecord: function(rec) {
    this.record = rec;
    this.get('folderForm').getForm().loadRecord(rec);
  },
  
  onOk: function() {
    var formPanel = this.get('folderForm');
    var form = formPanel.getForm();
    if (!form.isValid()) {
      return false;
    }
    this.fireEvent('ok', formPanel, form.getValues());
    form.reset();
    this.hide();
  },
  
  onCancel: function() {
    this.get('folderForm').getForm().reset();
    this.hide();
  },
  
});
