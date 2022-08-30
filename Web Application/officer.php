<?php
    include("./auth.php");
    
    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
?>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ANS officer</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="./_assets/all.min.css">
    <link rel="stylesheet" href="./_assets/bootstrap.min.css">

    <link rel="stylesheet" href="./_assets/tempusdominus-bootstrap-4.min.css">
   
    <link rel="stylesheet" href="./_assets/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/buttons.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/fixedColumns.bootstrap4.min.css">
    <link rel="stylesheet" href="./_assets/summernote-bs4.min.css">
    <link rel="stylesheet" href="./_assets/select2.min.css">

    <link rel="stylesheet" href="./_assets/leaflet-geoman.css">
    <link rel="stylesheet" href="./_assets/leaflet.css">
    <link rel="stylesheet" href="./_assets/leaflet.fullscreen.css">

    <!-- Theme style -->
    <link rel="stylesheet" href="./_assets/adminlte.min.css">
    <style>
            .loading-screen{
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        backdrop-filter: blur(4px);
    }

    .spin-center{
        left: 50%;
        margin-left: -4em;
    }

    </style>
</head>

<body class="hold-transition">

    <!-- layout-navbar-fixed layout-fixed -->
    <div class="wrapper">
        <div>
            <nav id="header" class="main-header bg-light navbar navbar-expand">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a id="menu-button" class="nav-link " data-widget="pushmenu" href="#" role="button">
                            <i class="fas fa-bars"></i>
                        </a>
                    </li>
                    <div id="content-header-left"></div>
                </ul>
                <!-- Messages Dropdown Menu -->
                <ul class="navbar-nav ml-auto">
                    <div id="content-header-right"></div>
                    <li onclick="setMainContent('all-zones')" class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link ">All Zones</a>
                    </li>
                    <li onclick="setMainContent('zones')" class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link ">Zones</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a target="_blank" href="./last_location.php" class="nav-link ">Users last locations</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="./sign_out.php" class="nav-link ">Log out</a>
                    </li>
                </ul>
            </nav>
        </div>

        <aside id="sidebar" class="main-sidebar elevation-4 sidebar-dark-primary">
            <!-- Brand Logo -->
            <a href="#" class="brand-link">
                <span class="brand-text font-weight-light">Alert Navigation System</span>
            </a>

            <!-- Sidebar -->
            <div class="sidebar">
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="./_assets/officer_avatar.jpg" class="img-circle elevation-0" alt="User Image">
                    </div>
                    <div class="info">
                        <a href="#" class="d-block"><?php echo $_SESSION["account_name"] ?></a>
                    </div>
                </div>

                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                        data-accordion="false">
                        <li id="tab-btn-contact" class="nav-item" onclick="setMainContentFromSideBar('zones')">
                            <a href="#" class="nav-link">
                                <p>
                                    Zones
                                </p>
                            </a>
                        </li>
                        <li id="tab-btn-contact" class="nav-item" onclick="setMainContentFromSideBar('all-zones')">
                            <a href="#" class="nav-link">
                                <p>
                                    All Zones
                                </p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a target="_blank" href="./last_location.php" class="nav-link">
                                <p>
                                    Users last socation
                                </p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="./sign_out.php" class="nav-link">
                                <p>
                                    Log out
                                </p>
                            </a>
                        </li>
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>
        <!-- /.control-sidebar -->

        <!-- Content Wrapper. Contains page content -->
        <div id="content" class="content-wrapper">
            <!-- Content Header (Page header) -->
           
            <!-- /.content-header -->

            <!-- Main content -->
            <div class="content p-3">
                <div class="container-fluid">
                    <div class="row w-100" id="zones-container" hidden>
                        <input accept="application/json" type="file" name="zone-upload" id="zone-upload" hidden>
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">My Zones</h3>
                                    <span class="float-right">
                                        <button type="button" class="btn btn-primary btn-flat" onclick="setAddZoneModal()">
                                            Add New
                                        </button>
                                        <a role="button" class="btn btn-primary btn-flat" target="_blank" href="./visualize.php?officer_id=<?php echo $_SESSION["account_id"]; ?>">
                                            Track My Zones
                                        </a>
                                    </span>
                                </div>
                                <div class="card-body">
                                    <ul class="nav nav-tabs">
                                        <li class="nav-item" onclick="adjustOutSideZones()">
                                            <a class="nav-link" id="zones-inside" data-toggle="tab" href="#zones-inside-tab" role="tab" aria-controls="zones-inside-tab" aria-selected="true">Intrusion Alert Zones</a>
                                        </li>
                                        <li class="nav-item" onclick="adjustOutSideZones()">
                                            <a class="nav-link" id="zones-outside" data-toggle="tab" href="#zones-outside-tab" role="tab" aria-controls="zones-outside-tab" aria-selected="true">Exit Alert Zones</a>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane fade show active" role="tabpanel" id="zones-inside-tab">
                                            <table id="inside-zones-table" class="table table-bordered table-striped table-hover w-100">
                                            <thead class="w-100">
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th>Intruders</th>
                                                <th>SI.No</th>
                                                <th>Zone Name</th>
                                                <th>Area Name</th>
                                                <th>Created At</th>
                                                <th>Last Modified</th>
                                            </tr>
                                            </thead>
                                            <tbody id="inside-zones-table-body">
                                            </tbody>
                                            </table>
                                        </div>
                                        <div class="tab-pane fade" role="tabpanel" id="zones-outside-tab">
                                            <table id="outside-zones-table" class="table table-bordered table-striped table-hover w-100">
                                                <thead class="w-100">
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th>Extruders</th>
                                                    <th>SI.No</th>
                                                    <th>Zone Name</th>
                                                    <th>Area Name</th>
                                                    <th>Created At</th>
                                                    <th>Last Modified</th>
                                                </tr>
                                                </thead>
                                                <tbody id="outside-zones-table-body">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row w-100" id="all-zones-container" hidden>
                        <div class="col-12">
                            <div class="card">
                                <!-- <div class="card-header">
                                    <h3 class="card-title">All Zones</h3>
                                    <span class="float-right">
                                        <button type="button" class="btn btn-default btn-flat">
                                            Index
                                        </button>
                                    </span>
                                </div> -->
                                <!-- <div class="card-body"> -->
                                    <div id='all-zones-map' style="width:100%;height:85vh"></div>
                                    </div>
                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                <!-- /.container-fluid -->
                </div>
            <!-- /.content -->
            </div>
        <!-- /.content-wrapper -->

        <div id="main-loader" class="loading-screen">
            <div class="spinner-border text-primary spin-center" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

    </div>

    <div class="modal fade" id="warning-modal" style="z-index:3000">
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <p id='warning-modal-content'></p>
              <button type="button" class="btn btn-info btn-flat float-right" data-dismiss="modal">
                  Okay
              </button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <div class="modal fade" id="normal-modal"  data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header"><h5 class="w-100" id='normal-modal-title'>Header</h5></div>
            <div class="modal-body" id='normal-modal-content' style="max-height:70vh;overflow:auto">
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-flat" data-dismiss="modal">
                    Close
                </button>
                <button id='normal-modal-remove' type="button" class="btn btn-danger btn-flat" hidden>
                    Remove
                </button>
                <button id='normal-modal-register' type="button" class="btn btn-primary btn-flat" hidden>
                    Submit
                </button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
 
      <!-- /.modal -->
    <div class="modal fade" id="drawer-modal" data-backdrop="static" data-keyboard="false">
        <div style="max-width:80vw;min-width:80vw" class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="w-50" id='drawer-modal-title'>Polygon Data Editor</h5>
                  <div class="float-right w-50">
                  <div class="form-inline">
                    <div class="input-group w-100">
                        <input id="geometry-search" class="form-control" type="search" placeholder="Search" aria-label="Search">
                        <div id="geometry-search-button" data-toggle="dropdown" class="input-group-text btn" onclick="getAddressDetails()">
                            <i class="fas fa-search fa-fw"></i>
                        </div>
                        <div id="geometry-search-result" class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            
                        </div>
                        </div>
                    </div>
                  </div>
                </div>
            <div class="modal-body" id='drawer-modal-content' style="width:100%;height:70vh">
              Hello
            </div>
            <div class="modal-footer">
                <button id='drawer-modal-register' class="btn btn-default btn-flat" data-dismiss="modal">
                    Cancel
                </button>
                <button id='drawer-modal-save' type="button" class="btn btn-primary btn-flat">
                    Save
                </button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="description-modal"  data-backdrop="static" data-keyboard="false">
        <div style="max-width:80vw;min-width:80vw" class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header"><h5 class="w-100" id='description-modal-title'>Description Editor</h5></div>
            <div class="modal-body" id='description-modal-content' style="width:100%;height:70vh">
                <textarea name="description-modal-content-text" id="description-modal-content-text" rows="10"></textarea>
            </div>
            <div class="modal-footer">
                <button id='drawer-modal-register' class="btn btn-default btn-flat" data-dismiss="modal">
                    Cancel
                </button>
                <button id='description-modal-save' type="button" class="btn btn-primary btn-flat">
                    Save
                </button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
     <!-- /.modal -->


    <!-- REQUIRED SCRIPTS -->
    <!-- jQuery -->
    <script src="./_assets/jquery.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="./_assets/bootstrap.bundle.min.js"></script>

    <script src="./_assets/moment.min.js"></script>

    <script src="./_assets/tempusdominus-bootstrap-4.min.js"></script>
    
    <!-- for data tables -->
    <script src="./_assets/jquery.dataTables.min.js"></script>
    <script src="./_assets/dataTables.bootstrap4.min.js"></script>
    <script src="./_assets/dataTables.responsive.min.js"></script>
    <script src="./_assets/responsive.bootstrap4.min.js"></script>
    <script src="./_assets/dataTables.buttons.min.js"></script>
    <script src="./_assets/buttons.bootstrap4.min.js"></script>
    <script src="./_assets/jszip.min.js"></script>
    <!-- <script src="./_assets/pdfmake/pdfmake.min.js"></script> -->
    <script src="./_assets/buttons.html5.min.js"></script>
    <script src="./_assets/buttons.print.min.js"></script>
    <script src="./_assets/fixedColumns.bootstrap4.min.js"></script>
    <script src="./_assets/buttons.colVis.min.js"></script>

    <script src="./_assets/summernote-bs4.min.js"></script>

    <script src="./_assets/select2.full.min.js"></script>
    <script src="./_assets/leaflet.js"></script>
    <script src="./_assets/Leaflet.fullscreen.min.js"></script>
    <script src="./_assets/leaflet-geoman.min.js"></script>
    <!-- AdminLTE App -->
    <script src="./_assets/adminlte.min.js"></script>
    
    <script src="./_assets/colors.js"></script>
    <script src="./_assets/officer.js"></script>
    <script src="./_assets/places_autocomplete.js"></script>
  </body>

</html>