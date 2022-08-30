<?php
    session_start();
    // Destroy session
    if(session_destroy()) {
        // Redirecting To Home Page
        setcookie('account_name',"", time() - 4000, "/");
        setcookie('password',"", time() - 4000, "/");
        header("Location: ./sign_in.php");
    }
?>