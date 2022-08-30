<?php
     include("./auth.php");
     include("./DBManager.php");
 
     if($_SESSION["account_type"] != "officer"){
         header("Location: ./sign_out.php");
     }
    
    $condition = '';
    
    if(isset($_GET['condition'])){
        $condition = $_GET['condition'];
    }

    $res = getVisualizeData($condition);
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