
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  var loginPanel = new Ext.Panel({
    id: 'loginPanel',
    border: true,
    items: [new LoginForm({
      id: 'loginForm',
      url: BASE_URL + 'ajax/login',
      keys: [{
        key: [Ext.EventObject.ENTER],
        fn: doLogin
      }]
    })],
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
           //Ext.get('error-msg').update('Invalid username or password');
           Ext.getCmp('statusBar').setStatus({
             text: 'Invalid username or password!',
             iconCls: 'x-status-error'
           });
         } 
      }
    });
  };
  
  Ext.getCmp('loginBtn').on('click', function() {
    doLogin();
  });
  
  Ext.get('lostPwLink').on('click', function() {
    console.log('Todo: lostPasswordFunction');
  });
  
  Ext.getCmp('statusBar').clearStatus();
  
});
