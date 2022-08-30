<?php

    require_once './vendor/autoload.php';
 
    use Ramsey\Uuid\Uuid;
    
    $con = mysqli_connect("localhost","root","","fyp_22");
    // $con = mysqli_connect("localhost","id19029632_root","Keerthi@2001","id19029632_fyp_22");

    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    function getAccount($account,$pass){

        global $con;

        $query = "select account_id,account_name,account_type from accounts where account_name='$account' and password='$pass'";

        return mysqli_query($con,$query);
    }

    function getUsers($condition=''){
        global $con;
        
        $q = "SELECT * FROM users";

        if($condition !== '')
            $q = $q." WHERE ".$condition;
        return mysqli_query($con, $q);    
    }

    function addUser($name,$pass,$mail,$phone){
        global $con;

        $id = Uuid::uuid4()->toString();

        $res = mysqli_query($con,"INSERT INTO `users` (user_id,user_name,user_mail,user_phone) VALUES ('$id','$name', '$mail','$phone')");

        if($res){
            
            $pass = md5($pass);

            return mysqli_query($con,"INSERT INTO `accounts` (`account_id`, `account_name`, `password`, `account_type`) VALUES ('$id', '$name', '$pass', 'user')");
        }

        return false;
    }

    function addZone($officer,$description,$zone_name,$area_address,$message,$geometry,$zone_type,$group_name,$included_users){
        global $con;

        $id = Uuid::uuid4()->toString();

        $query = "INSERT INTO `zones` (`zone_id`, `zone_name`, `area_address`, `geometry`, `message`, `officer_id`, `description`,zone_type,group_name,included_users) VALUES ('$id', '$zone_name', '$area_address', ST_GeomFromGeoJSON('$geometry'), '$message', '$officer', '$description','$zone_type','$group_name','$included_users')";

        return mysqli_query($con, $query);    
    }

    function modifyZone($officer,$zone_id,$description,$zone_name,$area_address,$message,$geometry,$zone_type,$group_name,$included_users){
        global $con;
        $query = "UPDATE `zones` SET zone_type='$zone_type',group_name='$group_name',included_users='$included_users',`zone_name`='$zone_name',`area_address`='$area_address',`message`='$message',`description`='$description',`geometry` = ST_GeomFromGeoJSON('$geometry'),modified = CURRENT_TIMESTAMP WHERE  `zone_id` = '$zone_id' and officer_id = '$officer'";
        return mysqli_query($con, $query);    
    }

    function getUserNameAndId($condition=''){
        global $con;
        
        $q = "SELECT user_id,user_name FROM users";

        if($condition !== '')
            $q = $q." WHERE ".$condition;
        return mysqli_query($con, $q); 
    }

    // -----------------------------

     function insertIntruder($zone_id,$user_id,$officer_id,$time_now,$lat,$long){
        global $con;
        $query="Insert into intruders (zone_id,user_id,officer_id,time,lat,`long`) values ('$zone_id','$user_id','$officer_id','$time_now',$lat,$long)";
        return mysqli_query($con,$query);
    }
    function insertExtruder($zone_id,$user_id,$officer_id,$time_now,$lat,$long){
        global $con;
        $query="Insert into extruders (zone_id,user_id,officer_id,time,lat,`long`) values ('$zone_id','$user_id','$officer_id','$time_now',$lat,$long)";
        return mysqli_query($con,$query);
    }

    function modifyLastLocation($user_id,$marker_status,$lat,$long,$last_checked){
        global $con;
        $query = "UPDATE `users` SET marker_status='$marker_status',lat=$lat,`long`=$long,last_checked='$last_checked' where user_id='$user_id'";
        return mysqli_query($con,$query);
    }

    function getVisualizeData($condition=''){
        global $con;
        
        $query1 = "SELECT i.time,i.zone_id,u.user_mail,u.user_name,u.user_id,i.lat,i.`long` from users u,intruders i where u.user_id  = i.user_id";
        $query2 = "SELECT e.time,e.zone_id,u.user_mail,u.user_name,u.user_id,e.lat,e.`long` from users u,extruders e where u.user_id  = e.user_id";
        
        if($condition != ""){
            $query1 = $query1." and ".$condition." ";
            $query2 = $query2." and ".$condition." ";
        }

        $query = $query1." UNION ALL ".$query2;
        
        return mysqli_query($con,$query);
    }

    function getLastLocation($condition=''){
        global $con;
        
        $query = "SELECT user_mail,user_id,user_name,lat,`long`,last_checked,marker_status from users where marker_status is not null";
        
        if($condition != ""){
            $query = $query." and ".$condition;
        }
        
        return mysqli_query($con,$query);
    }

    // ---------------------------------------------------

    function getIntruder($condition=''){
        global $con;
        $query="select i.time,i.s_no,u.user_name,u.user_mail,u.user_phone,u.user_id,o.officer_name,o.officer_id,z.zone_name,z.zone_id from users u,zones z,officers o,intruders i where u.user_id  = i.user_id and o.officer_id = i.officer_id and z.zone_id =  i.zone_id";
        if($condition != ""){
            $query = $query." and ".$condition;
        }
        $query=$query." order by time desc";
        return mysqli_query($con,$query);
    }

    function getExtruders($condition=''){
        global $con;
        $query="select e.time,e.s_no,u.user_name,u.user_mail,u.user_phone,u.user_id,o.officer_name,o.officer_id,z.zone_name,z.zone_id from users u,zones z,officers o,extruders e where u.user_id = e.user_id and o.officer_id=e.officer_id and z.zone_id=e.zone_id";
        if($condition != ""){
            $query = $query." and ".$condition;
        }
        $query=$query." order by time desc";
        return mysqli_query($con,$query);       
    }


    function getZones($condition = ''){
        global $con;

        $query = "select z.`s_no`,z.zone_type,z.group_name,z.included_users,z.`zone_id`, z.`zone_name`, z.`area_address`, ST_AsGeoJSON(z.geometry) as geometry, z.`message`, z.`created`, z.`modified`, z.officer_id, o.officer_name, z.description from zones z,officers o  where z.officer_id = o.officer_id";

        if($condition != ""){
            $query = $query." and ".$condition;
        }

        $query = $query." order by modified";

        return mysqli_query($con, $query);    
    }

    function removeZone($zone_id,$officer){
        global $con;
        $query = "DELETE FROM zones WHERE zone_id='$zone_id' and officer_id='$officer';";
        return mysqli_query($con, $query);    
    }

?>