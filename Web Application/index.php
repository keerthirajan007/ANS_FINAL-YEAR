<?php
    include("./auth.php");

    if($_SESSION["account_type"] == "user"){
        header("Location: /user.php");
    }else if($_SESSION["account_type"] == "officer"){
        header("Location: /officer.php");
    }
?>