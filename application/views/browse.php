<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>ON.load | Browse with tree</title>
  <?php $this->load->view('extjs_header');?>
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/css/style.css" />
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/treegrid.css" rel="stylesheet" />
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGridSorter.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGridColumnResizer.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGridNodeUI.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGridLoader.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGridColumns.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/ext/ux/treegrid/TreeGrid.js"></script>
  <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/tree.js"></script>
</head>
<body>

  <header>
    <h1>ON.load</h1>
  </header>
  
  <nav>
    <ul>
      <li><a id="a-logout" href="#">Logout</a></li>
      <li><a href="#">Change Password</a></li>
    </ul>
  </nav>
  
  <section>
    <div id="content-panel"></div>
  </section>

</body>
</html>