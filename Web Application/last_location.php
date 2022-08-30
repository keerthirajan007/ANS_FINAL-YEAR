<?php
    include("./auth.php");
    include("./DBManager.php");

    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
?>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Users last location</title>

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
        .custom-marker-label{
            width:"fit-content !important"
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
                                <h3 class="card-title">Users last locations(only active users)</h3>
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
    <script src="./_assets/last_location.js"></script>    
  </body>

</html>