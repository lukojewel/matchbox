function initMap() {

    if((localStorage.getItem('citiesData'))){
        var tempfilterData = JSON.parse((localStorage.getItem('citiesData')));
        var filterData = tempfilterData.rooms;
        var locations = [];
        
        for (var i = filterData.length - 1; i >= 0; i--) {
            var location = {
                info: '<strong>Chipotle on Sheridan</strong><br>\r\
                            6600 N Sheridan Rd<br> Karnataka 562125<br>\
                            <a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>', 
                lat: filterData[i].loc[0],
                long: filterData[i].loc[1]
            };
            locations.push([location.info, location.lat, location.long, ],)
        }

        // Initaial position of map
        var latmap=[filterData[0].loc[1]];
        var lonmap=[filterData[0].loc[0]];
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: new google.maps.LatLng( latmap, lonmap),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow({});

        var marker, i;
        var icon = {
            url: "assets/img/Map-Marker.png",
            scaledSize: new google.maps.Size(30, 30), 
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        // Ploting Markers 
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                icon: icon,   
                position: new google.maps.LatLng( locations[i][2], locations[i][1] ),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }     
    }
}
