<?php
  include("./auth.php");
  include("./DBManager.php");
    
  if($_SESSION["account_type"] != "officer"){
    header("Location: ./sign_out.php");
  }
 
  $input = file_get_contents('php://input'); 
  $r = json_decode($input);

  $zone_id= $r-> zone_id;
  $res = removeZone($zone_id,$_SESSION["account_id"]);
  $arr = [];
    if($res){
        $arr = array("status"=>"success");
    }else{
        $arr = array("status"=>"failed");
        $arr["reason"] = mysqli_error($con);
    }
    echo json_encode($arr);


?>