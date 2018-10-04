function initMap() {
     


	// var broadway = {
	// 	info: '<strong>Chipotle on Broadway</strong><br>\
	// 				5224 N Broadway St<br> Chicago, IL 60640<br>\
	// 				<a href="https://goo.gl/maps/jKNEDz4SyyH2">Get Directions</a>',
	// 	lat: 12.97166580919054,
	// 	long: 77.59622508465577
	// };

	// var belmont = {
	// 	info: '<strong>Chipotle on Belmont</strong><br>\
	// 				1025 W Belmont Ave<br> Chicago, IL 60657<br>\
	// 				<a href="https://goo.gl/maps/PHfsWTvgKa92">Get Directions</a>',
	// 	lat: 12.93166580919054,
	// 	long: 77.59622502465577
	// };

	// var sheridan = {
	// 	info: '<strong>Chipotle on Sheridan</strong><br>\r\
	// 				6600 N Sheridan Rd<br> Karnataka 562125<br>\
	// 				<a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>', 
	// 	lat: 12.898705,
	// 	long: 77.794365
	// };

	
    if((localStorage.getItem('citiesData'))){
        var cityCentersmapData = JSON.parse((localStorage.getItem('citiesData')));
        for (i = 0; i < cityCentersmapData.spaces.length; i++) {
            console.log('cities data from map.js',cityCentersmapData);

            var mapdata = [cityCentersmapData.spaces[i].loc[1] ];
            var mapdata2 = [cityCentersmapData.spaces[i].loc[0] ];
            var mapDetails = {
                info: '<strong>Chipotle on Sheridan</strong><br>\r\
                            6600 N Sheridan Rd<br> Karnataka 562125<br>\
                            <a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>', 
                lat: [cityCentersmapData.spaces[i].loc[1] ],
                long: [cityCentersmapData.spaces[i].loc[0] ]
            };
        }

        console.log('location data are::::',mapdata,mapdata2);
        console.log('location mapInfo::::',mapInfostore);

	   	var locations = [
	    	[ mapDetails.info, mapDetails.lat, mapDetails.long ]
	    ];

	    var latmap=[cityCentersmapData.spaces[0].loc[1]];
	    var lonmap=[cityCentersmapData.spaces[0].loc[0]];

		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: new google.maps.LatLng(latmap,lonmap),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow({});

		var marker, i;
	    var icon = {
	        url: "assets/img/Map-Marker.png", // url
	        scaledSize: new google.maps.Size(30, 30), // scaled size
	        origin: new google.maps.Point(0,0), // origin
	        anchor: new google.maps.Point(0, 0) // anchor
	    };
		for (i = 0; i < locations.length; i++) {
			marker = new google.maps.Marker({
	            icon: icon,   
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
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

    // If any data found from Filter API
    if((localStorage.getItem('filterData'))){
        var filterData = JSON.parse((localStorage.getItem('filterData')));
        var locations = [];
        
        for (var i = filterData.length - 1; i >= 0; i--) {
            console.log('cities data from map.js',filterData);
			
			// Need location info to show dialogue box inside Map
			var location = {
			    info: '<strong>Chipotle on Sheridan</strong><br>\r\
			                6600 N Sheridan Rd<br> Karnataka 562125<br>\
			                <a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>', 
			    lat: filterData[i].loc[0],
			    long: filterData[i].loc[1]
			};
			
			// Location inofmation to array
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
	        url: "assets/img/Map-Marker.png", // url
	        scaledSize: new google.maps.Size(30, 30), // scaled size
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
