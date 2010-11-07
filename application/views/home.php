<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title><?php echo $title;?></title>
  <?php $this->load->view('extjs_header');?>
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
  <?php if ($user->admin): ?>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/UserForm.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/admin.js"></script>
  <?php endif; ?>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/browser.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/onload.js"></script>
</head>
<body>

  <header>
    <h1>ON.load</h1>
  </header>
  
  <nav>
    <ul>
    	<li><a id="a-logout" href="#">Logout</a></li>
    	<li><a href="#">Change Password</a></li>
    	<?php if ($user->admin): ?>
    	 <li><a id="a-admin" href="#">Admin</a></li>
    	<?php endif; ?>
    </ul>
  </nav>
  
  <section>
    <div id="content-panel"></div>
  </section>

</body>
</html>