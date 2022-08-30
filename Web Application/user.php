<?php
    include("./auth.php");
    
    if($_SESSION["account_type"] != "user"){
        header("Location: ./sign_out.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./_assets/index.css">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
    integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
    integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
    crossorigin=""></script>
    <title>AMS</title>
</head>
<body>
      <div class="parent">
          
          <div><h1>Alert Navigation System</h1></div>

          <div class="child">
              <div id="map" class="child1" >
                

              </div>
              <div class="child2">

              <div class="zones">
              <button type="button" class="btn btn-primary my-location" onclick="myLocation()">My Location</button>

                  <button class="zone-1 zone btn btn-dark" onclick="zoneFinder(1)">Zones Within 1 km</button>
                  <button class="zone-2 zone btn btn-dark" onclick="zoneFinder(5)">Zones Within 5 km</button>
                  <button class="zone-3 zone btn btn-dark" onclick="zoneFinder(10)">Zones within 10 km</button>
                  <button class="zone-4 zone btn btn-dark" onclick="zoneFinder(50)">Zones within 50 km</button>
                  <button class="zone-5 zone btn btn-dark" onclick="zoneFinder(1000)">Zones Within 1000 km</button>
              </div>
              
              </div>

          </div>
      </div>
   <script>
var zones= <?php
include("./get_all_zones.php");
?>;
var user_id_='<?php 
echo $_SESSION['account_id'];
?>'
</script>
<script src="./_assets/leaflet.js"></script>
<script src="./_assets/user.js"></script>
    </body>
</html