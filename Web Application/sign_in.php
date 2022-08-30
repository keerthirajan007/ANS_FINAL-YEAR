<?php
    require_once('./DBManager.php');

    session_start();

    $err = '';
    $account = '';
    $pass = '';

    if (isset($_COOKIE['account_name'])) {
      $account = $_COOKIE['account_name'];
      $pass = $_COOKIE['password'];
      $res = getAccount($account,$pass);
      if(mysqli_num_rows($res) == 1){  
        echo "Successfully Logged";
        $row = mysqli_fetch_array($res);
        $_SESSION['account_id'] =   $row['account_id'];
        $_SESSION['account_name'] = $account;
        $_SESSION['account_type'] = $row['account_type'];
        header("Location: ./index.php");
    }else{
        $err= 'Incorrect account name/Password';
      }
    }else if (isset($_REQUEST['account_name'])) {
        $account = stripslashes($_REQUEST['account_name']);
        $account = mysqli_real_escape_string($con, $account);
        $pass = stripslashes($_REQUEST['password']);
        $pass = (mysqli_real_escape_string($con, $pass));
        $temp = md5($pass);
        $res = getAccount($account,$temp);
        
        if(mysqli_num_rows($res) == 1){  
            
            if(isset($_REQUEST["remember"])){
              $hour = time() + 3600 * 24 * 30;
              setcookie('account_name',$account, $hour,"/");
              setcookie('password', $temp, $hour,"/");
          }
          $row = mysqli_fetch_array($res);
          $_SESSION['account_id'] =   $row['account_id'];
          $_SESSION['account_name'] = $account;
          $_SESSION['account_type'] = $row['account_type'];
          header("Location: ./index.php");
        }else{
          $err= 'The account name or password you entered is incorrect';
        }
    } 
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign in</title>
  <link href="./_assets/img/favicon.ico?289349832" rel="icon" />

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="./_assets/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="./_assets/adminlte.min.css">
  <style>
    </style>
</head>

<body class="hold-transition login-page">
<div class="login-box">

<!-- /.login-logo -->
  <div class="card card-outline card-primary">
    
  <div class="card-header text-center">
      <a href="" class="h1">Alert Navigation System</a>
    </div>

    <div class="card-body">
    
    <?php 
      if($err){
        echo '<div class="alert alert-danger alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'.$err.'</div>';
      }
    ?>

    <form action="" method="post">
        <div class="input-group mb-3">
        <input required type="text" class="form-control" placeholder="account name"
        id="account_name" name="account_name" value="<?php echo $account?>">
          <div class="input-group-append">
            <span class="input-group-text"><i class="fa fa-user"></i></span>
          </div>
        </div>
        <div class="input-group mb-3">
        <input required type="password" class="form-control" placeholder="password"
        id="password" name="password" value="<?php echo $pass?>">
          <div class="input-group-append">
                <span id="eye-open" onclick="changeType('text')" class="input-group-text">
                  <i class="fas fa-eye"></i>
                </span>
                <span hidden id="eye-closed" onclick="changeType('password')"
                class="input-group-text">
                  <i class="fas fa-eye-slash"></i>
                </span>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <div class="icheck-primary">
              <input type="checkbox" id="remember" name="remember">
              <label for="remember">
                Remember Me
              </label>
            </div>
          </div>
          <div class="col-4">
            <button type="submit" class="btn btn-primary btn-block">Sign In</button>
          </div>
        </div>
      </form>
      <p class="mb-1">
        <a href="./forgot-send.php">Forgot Password</a>
      </p>
      <p class="mb-0">
        <a href="./sign_up.php" class="text-center">Don't have an account?</a>
      </p>
    </div>
    <!-- /.card-body -->
  </div>
  <!-- /.card -->
</div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="./_assets/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="./_assets/bootstrap.bundle.min.js"></script>
<!-- accountLTE App -->
<script src="./_assets/adminlte.min.js"></script>

<script>
        var pass = document.getElementById("password");
        var eye_o = document.getElementById("eye-open");
        var eye_c = document.getElementById("eye-closed");
        var changeType = (name) => {
            if (name == "text") {
                eye_o.hidden = true;
                eye_c.hidden = false;
                pass.type = "text"
            } else {
                eye_o.hidden = false;
                eye_c.hidden = true;
                pass.type = "password"
            }
        }
</script>

</body>
</html>
