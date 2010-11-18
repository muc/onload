<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title><?php echo $title;?></title>
  <?php $this->load->view('extjs_header');?>
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/js/ext/ux/roweditor/css/RowEditor.css" />
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.js"></script>
  
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ux/PermissionWin.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ux/permissionStores.js"></script>
  
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/roweditor/RowEditor.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ux/BrowserGrid.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/browser.js"></script>
</head>
<body>
  <?php if ($user->admin): ?>
    <script>var _isAdmin = true;</script>
  <?php endif; ?>
  <header>
    <h1>ON.load</h1>
  </header>
  
  <nav>
    <ul>
    	<li><a id="a-logout" href="#">Logout</a></li>
    	<li><a href="#">Change Password</a></li>
    	<?php if ($user->admin): ?>
    	 <li><a id="a-admin" href="admin">Admin</a></li>
    	<?php endif; ?>
    </ul>
  </nav>
  
  <section>
    <div id="content-panel"></div>
  </section>
  <form id="dlform" method="POST" action="browser/download">
    <input type="hidden" id="count" name="count"/>
    <input type="hidden" id="data" name="data" />
  </form>

</body>
</html>