<?php
    require_once('./DBManager.php');
      
    $input = file_get_contents('php://input'); 
    $r = json_decode($input);
    
    $result = array();

    $user = stripslashes($r->username);
    $user = mysqli_real_escape_string($con, $user);
    $mail = stripslashes($r->email);
    $mail = mysqli_real_escape_string($con, $mail);
    $phone = stripslashes($r->phone);
    $phone = mysqli_real_escape_string($con, $phone);
    $pass = stripslashes($r->password);
    $pass = (mysqli_real_escape_string($con, $pass));

    $valid = false;
    
    if(mysqli_num_rows(getUsers("user_name='$user'")) == 1){    
        $err= 'Username already taken';
    }else if(mysqli_num_rows(getUsers("user_mail='$mail'")) == 1){
        $err= 'Email already registered to another account';
    }else{
        $valid = true;
    }

    if($valid == true){
        $r = addUser($user,$pass,$mail,$phone);
        if($r){
            $result['status'] = "success";
            $result['data'] = mysqli_fetch_array(getUsers("user_name='$user'"), MYSQLI_ASSOC);
        }else{
            $err= 'Unexpected Error,Please try again';
            $valid = false;
        }
    }

    if($valid == false){
        $result['status'] = "failed";
        $result['reason'] = $err;
    }

    echo json_encode($result);
?>