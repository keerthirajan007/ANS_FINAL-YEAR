<?php
    session_start();
    if(!isset($_SESSION["account_id"])) {
        header("Location: ./sign_in.php");
        exit();
    }
?>