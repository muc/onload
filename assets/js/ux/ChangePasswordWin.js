Ext.apply(Ext.form.VTypes, {
  password : function(val, field) {
    if (field.initialPassField) {
      var pwd = Ext.getCmp(field.initialPassField);
      return (val == pwd.getValue());
    }
    return true;
  },
  passwordText : 'Passwords do not match'
});


ChangePasswordWin = Ext.extend(Ext.Window, {
  title: 'Change Password',
  id: 'cpWin',
  width: 372,
  frame: true,
  border: false,
  buttonAlign: 'center',
  autoHeight: true,
  resizable: false,
  initComponent: function() {
    this.items = [
      {
        xtype: 'form',
        id: 'cpForm',
        frame: true,
        border: false,
        padding: 5,
        labelWidth: 130,
        url: 'ajax/changepassword',
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'new Password',
            anchor: '100%',
            inputType: 'password',
            name: 'new_password',
            id: 'newPassword',
            allowBlank: false,
          },
          {
            xtype: 'textfield',
            fieldLabel: 'confirm new Password',
            anchor: '100%',
            inputType: 'password',
            name: 'cnew_password',
            id: 'cnewPassword',
            vtype: 'password',
            initialPassField: 'newPassword'
          }
        ]
      }
    ];
    this.fbar = {
      xtype: 'toolbar',
      items: [
        {
          xtype: 'button',
          text: 'Save',
          scope: this,
          handler: this.onSave
        },
        {
          xtype: 'button',
          text: 'Cancel',
          scope: this,
          handler: function() {
            this.close();
          }
        }
      ]
    };
    ChangePasswordWin.superclass.initComponent.call(this);
  },
  
  onSave: function() {
    var form = Ext.getCmp('cpForm').getForm();
    if (form.isValid()) {
      form.submit({
        success: function() {
          Ext.getCmp('cpWin').close();
        },
      });
    }
  }
});