<?php
    include("./auth.php");
    include("./DBManager.php");

    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
    $zone_id = $_GET['zone_id'];
    $res = getZones("z.zone_id = '$zone_id'");
    $row = mysqli_fetch_array($res, MYSQLI_ASSOC);
    
    $res1 = getIntruder("i.zone_id = '$zone_id'");
    
    $intruders = array();
    while ($r = mysqli_fetch_array($res1, MYSQLI_ASSOC)) {
        array_push($intruders,$r);
    }

    $zone_name = $row["zone_name"];
    ?>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Intruders for <?php echo $zone_name; ?></title>

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
                            <div class="card-body row">
                                <div style="height:300px" class="col-6" id="map">
                                </div>
                                <div class="col-6 d-flex align-items-center justify-content-center" id="desc">
                                   
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Intruders List( <?php echo $zone_name; ?>)</h3>
                                <span class="float-right">
                                        <a role="button" class="btn btn-primary btn-flat" target="_blank" href="./visualize.php?zone_id=<?php echo $zone_id; ?>">
                                            Track Intruders
                                        </a>
                                    </span>
                            </div>
                            <div class="card-body">
                                <table id="data-table" class="table table-bordered table-striped table-hover w-100">
                                <thead class="w-100">
                                <tr>
                                    <th>SI.No</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Time</th>
                                </tr>
                                </thead>
                                <tbody id="inside-zones-table-body">
                                </tbody>
                                </table>
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
    <script>
        let data = <?php echo json_encode($intruders); ?>;
        let zone_data = <?php echo json_encode($row); ?>;
        let type_mapper = {
            "inside":"Intrusion Alert Zone",
            "outside":"Exit Alert Zone",
        }
    </script>
    <script>
        let desc = document.getElementById("desc");

        dataTable = $("#data-table").DataTable({
        lengthChange: false,
        autoWidth: true,
        scrollX: true,
        select: true,
        scrollCollapse: true,
        buttons: [
            "copy",
            {
            extend: "csv",
            text: "CSV",
            filename: () => {
                var d = new Date(); // for now
                return (
                "Zones at " +
                d.toLocaleDateString().replace(/\//g, "-") +
                " " +
                d.toLocaleTimeString().replace(/\:/g, "-")
                );
            },
            },
            {
            extend: "excel",
            text: "Excel",
            filename: () => {
                var d = new Date(); // for now
                return (
                "Zones at " +
                " " +
                d.toLocaleDateString().replace(/\//g, "-") +
                " " +
                d.toLocaleTimeString().replace(/\:/g, "-")
                );
            },
            },
            "print",
            "colvis",
        ],
        fixedColumns: {
            left: 1,
        },
        });

        dataTable
        .buttons()
        .container()
        .appendTo("#data-table_wrapper .col-md-6:eq(0)");

    const map = L.map("map", {
            center: [11.1271, 78.6569],
            zoom: 10,
        });
        let baseMapUrl = "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png";
        L.tileLayer(baseMapUrl).addTo(map);


        window.addEventListener("load",(e) => {
            desc.innerHTML = `
            <dl class="row">
                <dt class="col-lg-4 col-md-4 col-sm-12">Zone Name</dt>
                <dd class="col-lg-8 col-md-8 col-sm-12">${zone_data.zone_name}</dd>
                <dt class="col-lg-4 col-md-4 col-sm-12">Zone Type</dt>
                <dd class="col-lg-8 col-md-8 col-sm-12">${type_mapper[zone_data.zone_type]}</dd>
                <dt class="col-lg-4 col-md-4 col-sm-12">Group</dt>
                <dd class="col-lg-8 col-md-8 col-sm-12">${zone_data.group_name}</dd>
                <dt class="col-lg-4 col-md-4 col-sm-12">Area</dt>
                <dd class="col-lg-8 col-md-8 col-sm-12">${zone_data.area_address}</dd>
                <dt class="col-lg-4 col-md-4 col-sm-12">Description</dt>
                <dd class="col-lg-8 col-md-8 col-sm-12">${zone_data.description}</dd>
            </dl>`
            const layer = L.geoJSON({
                type:"Feature",
                geometry:JSON.parse(zone_data.geometry),
                properties:{}
            }).addTo(map);

            map.fitBounds(layer.getBounds());

            let d = data.map((e,i)=>{
                return [e.s_no,e.user_name,e.user_mail,e.user_phone,e.time]
            })
            
            dataTable.clear().rows.add(d).draw();
        });

        
        window.addEventListener("resize", ()=>{
            dataTable.columns.adjust();
            map.invalidateSize();
        });
    </script>
  </body>

</html>