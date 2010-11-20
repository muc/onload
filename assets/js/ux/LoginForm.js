
LoginForm = Ext.extend(Ext.form.FormPanel, {
    title: 'Login',
    width: 300,
    height: 135,
    padding: 15,
    frame: false,
    border: false,
    labelWidth: 70,
    bodyStyle: '',
    id: 'loginForm',
    
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
            id: 'loginUserName',
            anchor: '97%',
            allowBlank: false
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Password',
            name: 'password',
            anchor: '97%',
            inputType: 'password',
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
              text: 'Lost password?',
              style: 'text-decoration: underline; color: blue; cursor: pointer;',
              id: 'lostPwLink'
          },
          {
              xtype: 'tbspacer',
              width: 19
          },
          {
              xtype: 'button',
              text: 'Login',
              id: 'loginBtn',
              iconCls: 'lock-go-icon',
              style: 'margin-right: 15px;'
          }
        ]
      };
    },
    
});
Ext.reg('LoginForm', LoginForm);