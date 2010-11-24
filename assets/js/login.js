/**
 * Login.js
 * 
 */

Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  // create the login form
  var loginForm = new LoginForm({
    id: 'loginForm',
    url: 'ajax/login',
    keys: [{
      key: [Ext.EventObject.ENTER],
      fn: doLogin
    }]
  });
  
  // create the forgot-password-form
  var fpForm = new ForgotPasswordForm({
    url: 'ajax/forgotpassword',
    keys: [{
      key: [Ext.EventObject.ENTER],
      fn: doGetNewPassword
    }]
  });
  
  // create the login panel, that holds loginForm and forgotPasswordForm
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
 
  /**
   * Function, that handles the ajax login procedure
   */
  function doLogin() {
    Ext.getCmp('loginForm').on({
      beforeaction: function() {
        // mask the form, before submitting
        if (Ext.getCmp('loginForm').getForm().isValid()) {
          Ext.getCmp('loginPanel').body.mask();
          Ext.getCmp('statusBar').showBusy('Authenticating ...');
        }
      }
    });
    Ext.getCmp('loginForm').getForm().submit({
      success: function() {
        // redirect to index if login was successful
        Ext.getCmp('loginPanel').getEl().fadeOut({callback: function() {
          window.location = BASE_URL;
        }});
      },
      failure: function(form, action) {
        // if login fails, unmask the form an show an error
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
  
  /**
   * Function, that handles the ajax forgot password procedure
   */
  function doGetNewPassword() {
    Ext.getCmp('fpForm').on({
      beforeaction: function() {
        // mask the form, before submitting
        if (Ext.getCmp('fpForm').getForm().isValid()) {
          Ext.getCmp('loginPanel').body.mask();
          Ext.getCmp('statusBar').showBusy('Authenticating ...');
        }
      }
    });
    Ext.getCmp('fpForm').getForm().submit({
      success: function(conn, response) {
        // on success, unmask the form and show a dialog
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
             // redirect to login form
             loginPanel.getLayout().setActiveItem(0);
           } 
         });
      },
      failure: function(form, action) {
        // on failure, unmask the form and shot the error
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
  
  // Click event on login button
  Ext.getCmp('loginBtn').on('click', function() {
    doLogin();
  });
  
  // Click event on send button
  Ext.getCmp('sendBtn').on('click', function() {
    doGetNewPassword();
  });
  
  // Click event on lost password link
  Ext.get('lostPwLink').on('click', function() {
    loginPanel.getLayout().setActiveItem(1);
  });
  
  // Click event on login link
  Ext.get('loginLink').on('click', function() {
    loginPanel.getLayout().setActiveItem(0);
  });
  
  Ext.getCmp('statusBar').clearStatus();
  Ext.getCmp('loginUserName').focus();
  
});
