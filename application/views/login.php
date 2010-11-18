<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title><?php echo $title;?></title>
  <?php $this->load->view('extjs_header');?>
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ux/LoginForm.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/login.js"></script>
</head>
<body>
  	<div id="sitewrapper">

		<header>
			<div id="logo"><a href="/"><img src="/assets/img/logo.png" border="0"></a></div>
		</header>
	
		<div id="login-form" style="width: 300px; margin: 100px auto;"></div>
	
	</div>
</body>
</html>