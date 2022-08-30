<?php
    include("./DBManager.php");

    include("./auth.php");
    
    if($_SESSION["account_type"] != "officer"){
        header("Location: ./sign_out.php");
    }
    
    $condition = "z.officer_id = '".$_SESSION['account_id']."'";    

    $res = getZones($condition);
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