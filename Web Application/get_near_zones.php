<?php
    include("./DBManager.php");
    $lat=$_GET['lat'];
    $long=$_GET['long'];
    $r = $_GET['radius'];
    $units=69.0;
    $conditon=  "MbrContains(GeomFromText (CONCAT('LINESTRING(',$lat-($r/$units),' ',$long-($r /($units* COS(RADIANS($lat)))),',', $lat+($r/$units) ,' ',$long+($r /($units * COS(RADIANS($lat)))),')')),  geometry)";
    $res = getZones($conditon);
    if($res){
        $resultSet = array();
        while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
            array_push($resultSet,$row);
        }
        echo json_encode($resultSet);
    }else{
        echo mysqli_error($con);
    }
?>