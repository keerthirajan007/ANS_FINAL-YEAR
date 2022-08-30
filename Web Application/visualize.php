<?php
    include("./auth.php");
    include("./DBManager.php");

    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
    $condition = '';
    $condition1 = '';
    if(isset($_GET["officer_id"])){
        $condition = "officer_id = '".$_GET["officer_id"]."'";
        $condition1 = "z.officer_id = '".$_GET["officer_id"]."'";
    }
    else if(isset($_GET["zone_id"])){
        $condition = "zone_id = '".$_GET["zone_id"]."'";
        $condition1 = "z.zone_id = '".$_GET["zone_id"]."'";
    }
?>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tracking Intruders/Extruders</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="./_assets/all.min.css">
    <link rel="stylesheet" href="./_assets/bootstrap.min.css">
   
    <link rel="stylesheet" href="./_assets/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/buttons.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/fixedColumns.bootstrap4.min.css">

    <link rel="stylesheet" href="./_assets/leaflet.css">

    <!-- Theme style -->
    <link rel="stylesheet" href="./_assets/adminlte.min.css">
    <style>
        .arrow-icon {
        width: 14px;
        height: 14px;
    }

        .arrow-icon > div {
            margin-left: -1px;
            margin-top: -3px;
            transform-origin: center center;
            font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
        }
    </style>
  </head>

<body class="sidebar-closed sidebar-collapse">

    <!-- layout-navbar-fixed layout-fixed -->
    <div class="wrapper">
        <!-- Content Wrapper. Contains page content -->
        <div id="content" class="content-wrapper">
            <!-- Content Header (Page header) -->
           
            <!-- /.content-header -->

            <!-- Main content -->
            <div class="content p-3">
                <div class="container-fluid">
                    <div class="row w-100" id="zones-container">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title" id="card-title">Tracking Zones</h3>
                            </div>
                            <div class="card-body">
                                <div style="height:100vh" id="map">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>

    <!-- REQUIRED SCRIPTS -->
    <!-- jQuery -->
    <script src="./_assets/jquery.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="./_assets/bootstrap.bundle.min.js"></script>

    <script src="./_assets/moment.min.js"></script>
    
    <!-- for data tables -->
    <script src="./_assets/jquery.dataTables.min.js"></script>
    <script src="./_assets/dataTables.bootstrap4.min.js"></script>
    <script src="./_assets/dataTables.responsive.min.js"></script>
    <script src="./_assets/responsive.bootstrap4.min.js"></script>
    <script src="./_assets/dataTables.buttons.min.js"></script>
    <script src="./_assets/buttons.bootstrap4.min.js"></script>
    <script src="./_assets/jszip.min.js"></script>
    <script src="./_assets/buttons.html5.min.js"></script>
    <script src="./_assets/buttons.print.min.js"></script>
    <script src="./_assets/fixedColumns.bootstrap4.min.js"></script>
    <script src="./_assets/buttons.colVis.min.js"></script>
    <script src="./_assets/leaflet.js"></script>
    <script src="./_assets/adminlte.min.js"></script>    
    <script src="./_assets/colors.js"></script> 
    <script src="./_assets/visualize.js"></script> 
    <script>
        const condition = "<?php echo $condition; ?>"
        const condition1 = "<?php echo $condition1; ?>"
    </script>   
  </body>

</html>