
Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.BLANK_IMAGE_URL = BASE_URL + 'assets/js/ext/resources/images/default/s.gif';
  
  var cardPanel = new Ext.Panel({
    id: 'cardPanel',
    layout: 'card',
    renderTo: 'content-panel',
    width: 940,
    autoHheight: true,
    border: false,
    items: [browserGrid],
    activeItem: 0,
  });
  
  var breadCrumb = new Ext.Toolbar({
    renderTo: browserGrid.tbar,
    items: [
      '<a href="#">Home</a> » Subfolder'
    ]
  });
  
  Ext.get('a-logout').on('click', function() {
    Ext.select('header').slideOut('r');
    Ext.select('nav').slideOut('l', {callback: function() {
      Ext.get('content-panel').switchOff({
        duration: 0.3,
        callback: function() {window.location = 'logout';}
      });
    }});
  });
  
});

