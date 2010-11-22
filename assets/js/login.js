
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  var loginForm = new LoginForm({
    id: 'loginForm',
    url: 'ajax/login',
    keys: [{
      key: [Ext.EventObject.ENTER],
      fn: doLogin
    }]
  });
  
  var fpForm = new ForgotPasswordForm({
    url: 'ajax/forgotpassword',
    keys: [{
      key: [Ext.EventObject.ENTER],
      fn: doGetNewPassword
    }]
  });
  
  var loginPanel = new Ext.Panel({
    id: 'loginPanel',
    border: true,
    layout: 'card',
    activeItem: 0,
    items: [loginForm, fpForm],
    renderTo: 'login-form',
    bbar: new Ext.ux.StatusBar({
      id: 'statusBar',
      defaultText: 'Ready',
    })
  });
 

  function doLogin() {
    Ext.getCmp('loginForm').on({
      beforeaction: function() {
        if (Ext.getCmp('loginForm').getForm().isValid()) {
          Ext.getCmp('loginPanel').body.mask();
          Ext.getCmp('statusBar').showBusy('Authenticating ...');
        }
      }
    });
    Ext.getCmp('loginForm').getForm().submit({
      success: function() {
        Ext.getCmp('loginPanel').getEl().fadeOut({callback: function() {
          window.location = BASE_URL;
        }});
      },
      failure: function(form, action) {
         Ext.getCmp('loginPanel').body.unmask();
         Ext.getCmp('statusBar').clearStatus();
         if (action.failureType == 'server') {
           Ext.getCmp('statusBar').setStatus({
             text: 'Invalid username or password!',
             iconCls: 'x-status-error'
           });
         } 
      }
    });
  };
  
  function doGetNewPassword() {
    Ext.getCmp('fpForm').on({
      beforeaction: function() {
        if (Ext.getCmp('fpForm').getForm().isValid()) {
          Ext.getCmp('loginPanel').body.mask();
          Ext.getCmp('statusBar').showBusy('Authenticating ...');
        }
      }
    });
    Ext.getCmp('fpForm').getForm().submit({
      success: function(conn, response) {
        var data = Ext.util.JSON.decode(response.response.responseText);
        var newpass = data.data.newpass;
         Ext.getCmp('loginPanel').body.unmask();
         Ext.getCmp('statusBar').clearStatus();
         Ext.Msg.show({
           title: 'Password resetted',
           msg: 'Your new password was send to your email address.',
           buttons: Ext.Msg.OK,
           icon: Ext.Msg.INFO,
           fn: function(btn) {
             loginPanel.getLayout().setActiveItem(0);
           } 
         });
      },
      failure: function(form, action) {
        Ext.getCmp('loginPanel').body.unmask();
        Ext.getCmp('statusBar').clearStatus();
        if (action.failureType == 'server') {
          Ext.getCmp('statusBar').setStatus({
            text: 'Username and email doesn\t match!',
            iconCls: 'x-status-error'
          });
        } 
      }
    });
  }
  
  Ext.getCmp('loginBtn').on('click', function() {
    doLogin();
  });
  
  Ext.getCmp('sendBtn').on('click', function() {
    doGetNewPassword();
  });
  
  Ext.get('lostPwLink').on('click', function() {
    loginPanel.getLayout().setActiveItem(1);
  });
  
  Ext.get('loginLink').on('click', function() {
    loginPanel.getLayout().setActiveItem(0);
  });
  
  Ext.getCmp('statusBar').clearStatus();
  
  Ext.getCmp('loginUserName').focus();
  
});
