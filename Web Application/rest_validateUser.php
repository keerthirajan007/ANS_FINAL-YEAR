<?php
    require_once('./DBManager.php');
      
    $input = file_get_contents('php://input'); 
    $r = json_decode($input);
    
    $result = array();

    $user = stripslashes($r->username);
    $user = mysqli_real_escape_string($con, $user);
    $pass = stripslashes($r->password);
    $pass = md5((mysqli_real_escape_string($con, $pass)));

    $res = getAccount($user,$pass);
    if(mysqli_num_rows($res) == 1){
        $arr = mysqli_fetch_array($res, MYSQLI_ASSOC);
        if($arr['account_type'] == "user"){
            $result['status'] = "success";
            $result['data'] = mysqli_fetch_array(getUsers("user_name='$user'"), MYSQLI_ASSOC);;
        }
        else{
            $result['status'] = "failed";
            $result['reason'] = "You are not a user";
        }
    }else{
        $result['status'] = "failed";
        $result['reason'] = "Incorrect Username/Password";
    }

    echo json_encode($result);
?>