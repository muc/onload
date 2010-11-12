<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Admin | ON.load</title>
  <?php $this->load->view('extjs_header');?>
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ux/UserForm.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/admin.js"></script>
</head>
<body>

  <header>
    <h1>ON.load</h1>
  </header>
  
  <nav>
    <ul>
      <li><a id="a-logout" href="#">Logout</a></li>
      <li><a href="#">Change Password</a></li>
      <li><a id="a-admin" href="..">File Browser</a></li>
    </ul>
  </nav>
  
  <section>
    <div id="content-panel"></div>
  </section>

</body>
</html>