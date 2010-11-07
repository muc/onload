UserForm = Ext.extend(Ext.form.FormPanel, {
  width: 330,
  padding: 5,
  buttonAlign: 'center',
  labelWidth: 80,
  defaults: {
    anchor: '100%',
    selectOnFocus: true,
    msgTarget: 'side',
  },
  record : null,
  
  initComponent : function() {
    this.items = this.buildForm();
    this.buttons = this.buildUI();
    UserForm.superclass.initComponent.call(this);
  },
  
  buildForm : function() {
    return [
      {
        xtype: 'fieldset',
        title: 'User details',
        border: false,
        items: [
          {
              xtype: 'textfield',
              fieldLabel: 'Username',
              name: 'username',
              width: 220,
              disabled: true,
              ref: '../usernameField'
          },
          {
              xtype: 'textfield',
              fieldLabel: 'E-Mail',
              name: 'email',
              width: 220,
              disabled: true,
              ref: '../emailField'
          },
          {
              xtype: 'textfield',
              fieldLabel: 'Password',
              name: 'password',
              width: 220,
              disabled: true,
              ref: '../passwordField'
          },
          {
              xtype: 'checkbox',
              fieldLabel: '',
              boxLabel: 'is Admin',
              name: 'admin',
              disabled: true,
              ref: '../adminField'
          }
        ]
      }
    ];
  },
  
  buildUI: function(){
    return [
      { ref: '../saveBtn', text: 'Save', hidden: true, handler: doUserSave, scope: this},
      { ref: '../cancelBtn', text: 'Cancel', hidden: true, handler: doUserCancel, scope: this}
    ];
  },
  
  /**
   * loadRecord
   * @param {Record} rec
   */
  loadRecord : function(rec) {
    this.record = rec;
    this.getForm().loadRecord(rec);
  }
  
});