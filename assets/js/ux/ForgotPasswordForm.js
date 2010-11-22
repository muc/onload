
ForgotPasswordForm = Ext.extend(Ext.form.FormPanel, {
    title: 'Get new Password',
    width: 300,
    height: 135,
    padding: 15,
    frame: false,
    border: false,
    labelWidth: 70,
    bodyStyle: '',
    id: 'fpForm',
    
    initComponent: function() {
      this.items = this.buildForm();
      this.fbar = this.buildToolBar();
      LoginForm.superclass.initComponent.call(this);
    },
    
    buildForm: function() {
      return [
        {
            xtype: 'textfield',
            fieldLabel: 'Username',
            name: 'username',
            ref: '../usernameField',
            id: 'fpUserName',
            anchor: '97%',
            allowBlank: false
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Email',
            name: 'email',
            anchor: '97%',
            allowBlank: false
        }
      ];
    },
    
    buildToolBar: function() {
      return {
        xtype: 'toolbar',
        items: [
          {
              xtype: 'label',
              text: 'Login',
              style: 'text-decoration: underline; color: blue; cursor: pointer;',
              id: 'loginLink'
          },
          {
              xtype: 'tbspacer',
              width: 19
          },
          {
              xtype: 'button',
              text: 'Send',
              id: 'sendBtn',
              iconCls: 'ok-icon',
              style: 'margin-right: 15px;'
          }
        ]
      };
    },
    
});
Ext.reg('ForgotPasswordForm', ForgotPasswordForm);