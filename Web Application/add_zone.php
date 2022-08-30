<?php
    include("./auth.php");
    include("./DBManager.php");
    // admin only
    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
    require_once './vendor/autoload.php';
    use Ramsey\Uuid\Uuid;
    
    $input = file_get_contents('php://input'); 
    $r = json_decode($input);

    $zone_name= mysqli_real_escape_string($con,stripslashes($r-> zone_name));
    $zone_type= mysqli_real_escape_string($con,stripslashes($r-> zone_type));
    $group_name= mysqli_real_escape_string($con,stripslashes($r-> group_name));
    $area_address = mysqli_real_escape_string($con,stripslashes($r->area_address));
    $message = mysqli_real_escape_string($con,stripslashes($r -> message));
    $geometry = $r -> geometry;
    $description = mysqli_real_escape_string($con,stripslashes($r -> description));
    $included_users= json_encode($r-> included_users);
    $res = addZone($_SESSION["account_id"],$description,$zone_name,$area_address,$message,json_encode($geometry),$zone_type,$group_name,$included_users);
    $arr = [];
    if($res){
        $arr = array("status"=>"success");
    }else{
        $arr = array("status"=>"failed");
        $arr["reason"] = mysqli_error($con);
    }
    echo json_encode($arr);
?>