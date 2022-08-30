<?php
 include('./DBManager.php');

  $lat=$_GET['lat'];
  $long=$_GET['long'];
  $uid=$_GET['uid'];
  $time = $_GET['time'] or now();
  $condition="st_within(ST_GeomFromText('Point($long $lat)'),geometry) and zone_type='inside'";
  $res = getZones($condition);
  
  $marker_status = "green";

  if($res){
      $resultSet = array();
      while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
        array_push($resultSet,$row);
        insertIntruder($row['zone_id'],$uid,$row['officer_id'],$time,$lat,$long); 
        $marker_status = "red"; 
      }
      echo json_encode($resultSet);

      modifyLastLocation($uid,$marker_status,$lat,$long,$time);
    
  }else{
      echo mysqli_error($con);
  }


?>