$( document ).ready(function() {

    var featuredSpacesData, cityInventoryData, spaceTypeData;
    var featuredSpacesUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/featuredSpaces";
    var cityInventoryUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/getCityInventory";

    var map;


    /* Init select box*/
    

    getRequest(featuredSpacesUrl, featuredSapces);
    getRequest(cityInventoryUrl, cityInventory);


    function getRequest(url,functionName){
        $.ajax({
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "GET",
            dataType: "json",
            success: function (result) {
                functionName(result);
            },
            error: function () {
                console.log("error");
            }
        });
    };

    function featuredSapces(response){
        featuredSpacesData= response;
        for (var i = response.data.length - 1; i >= 0; i--) {
            var temp_html =  
            
            '<div class="col-md-4 col-sm-6 col-12 ev-margin-top">'+
                '<div class="ev-fea-item">'+
                    '<a href="#">'+
                       ' <div class="ev-fea-image-overlay-wrapper">'+
                            '<img src="'+response.data[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
                            '<div class="ev-fea-image-overlay">'+
                            '</div>'+
                        '</div>'+
                        '<div class="carousel-caption text-left">'+
                            '<p>'+response.data[i].name+'</p>'+
                            '<span>Learn More</span>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '</div>';

            $("#ev-featured-wrapper").append(temp_html);
        }

    }

    function cityInventory(response){
        cityInventoryData= response.data.cities;
        spaceTypeData = response.data.inventories;

        for (var i = response.data.cities.length - 1; i >= 0; i--) {
            $('#cities').append('<option lat="'+response.data.cities[i].lat+'" lng="'+response.data.cities[i].lng+'" value="'+response.data.cities[i].cityValue+'">'+response.data.cities[i].city+'</option>');
        }

        for (var i = response.data.inventories.length - 1; i >= 0; i--) {
            $('#space-type').append('<option value="'+response.data.inventories[i].roomType+'">'+response.data.inventories[i].roomType+'</option>');
        }
        $('select').niceSelect();
    }

    $("#ev-banner-find-btn").click(function(event) {
        event.preventDefault();

        var tempSelectbox = $("#cities").find('option:selected'); 
        var tempSelectboxAttrLat = tempSelectbox.attr("lat");
        var tempSelectboxAttrLng = tempSelectbox.attr("lng");

        $.ajax({
            url: "http://mymatchbox.v1.idc.tarento.com/api/v2/getNearBySpace",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            dataType: "json",
            data: {"lon": tempSelectboxAttrLng, "lat": tempSelectboxAttrLat},
            success: function (result) {
                console.log(result);
                console.log("Inside")
                localStorage.setItem('citiesData', JSON.stringify(result));
                window.location.assign("file:///E:/matchbox-master/matchbox/list.html")
            },
            error: function (error) {
                console.log("error",error);
            }
        });
    });

    // $("#ev-banner-find-btn").click(function() {
    //     var tempSelectbox = $("#cities").find('option:selected'); 
    //     var tempSelectboxAttrLat = tempSelectbox.attr("lat");
    //     var tempSelectboxAttrLng = tempSelectbox.attr("lng");

    //     $.ajax({
    //         url: "http://mymatchbox.v1.idc.tarento.com/api/v2/getAvailableSpaces",
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         type: "POST",
    //         dataType: "json",
    //         data: {"lon": "77.63615519999996", "lat": "12.9265132"},
    //         success: function (result) {
    //             console.log(result);
    //             localStorage.setItem('citiesData', JSON.stringify(result));
    //             // window.location.assign("file:///C:/Users/Team%20Evoque/Desktop/my%20match%20box%20-%20Git/list.html")
    //         },
    //         error: function () {
    //             console.log("error");
    //         }
    //     });
    // });



    var locations= [];

    function initMap() {
      var uluru = {lat: 12.8873182, lng: 77.6396559};
      var map = new google.maps.Map(
          document.getElementById('googleMap'), {zoom: 14, center: uluru});
     var marker = new google.maps.Marker({position: uluru, map: map});
    }


    if((localStorage.getItem('citiesData'))){
        var cityCentersData = JSON.parse((localStorage.getItem('citiesData')));
        console.log("Inside cityCentersData");
        for (var i = cityCentersData.spaces.length - 1; i >= 0; i--) {
            var temp_html =  
            '<div class="col-md-6 col-sm-6 col-12 ev-margin-top">'+
                '<div class="ev-fea-item ev-list-item-wrapper">'+
                    '<a href="#">'+
                        '<img src="'+cityCentersData.spaces[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
                        '<div class="ev-listing-item-caption text-left">'+
                            '<h3>'+cityCentersData.spaces[i].name+', '+cityCentersData.spaces[i].locality+'</h3>'+
                            '<p>'+cityCentersData.spaces[i].address1 +', '+cityCentersData.spaces[i].address2 +'</p>'+
                            '<div>'+
                                '<a href="#" class="ev-primary-btn ev-list-item-cta-btn"> View More</a>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '</div>';

            $("#ev-center-list").append(temp_html);


            // var location = [ cityCentersData.spaces[i].name, response[i].Latitude, response[i].Longitude, response[i].VenueID ,response[i].Description, response[i].Images[0], response[i].Images[1], response[i].Street ];
            // locations.push(location);


        }
        // localStorage.clear();
    }

    var uluru = {lat: 12.8873182, lng: 77.6396559};

    // Initialize and add the map
    function initMap() {
      // The location of Uluru
      var uluru = {lat: 12.8873182, lng: 77.6396559};
      // The map, centered at Uluru
      var map = new google.maps.Map(
          document.getElementById('map'), {zoom: 4, center: uluru});
      // The marker, positioned at Uluru

      var marker = new google.maps.Marker({position: uluru, map: map});
    }

    // map=new google.maps.Map(document.getElementById("googleMap"), {
    //     zoom: 12,
    //     center: new google.maps.LatLng( 12.8873182, 77.6396559),
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     styles: [ {
    //             "elementType": "labels",
    //             "stylers": [ {
    //                 "visibility": "off"
    //             }]
    //         }, {
    //             "featureType": "administrative.land_parcel",
    //             "stylers": [ {
    //                 "visibility": "off"
    //         }]
    //         }, {
    //             "featureType": "administrative.neighborhood",
    //             "stylers": [ {
    //                 "visibility": "off"
    //         }]
    //         }, {
    //             "featureType": "poi.business",
    //             "stylers": [ {
    //                 "visibility": "off"
    //             }]
    //         }, {
    //             "featureType": "poi.park",
    //             "elementType": "labels.text",
    //             "stylers": [
    //             {
    //             "visibility": "off"
    //             }
    //         ]}
    //     ]
    // });

    



});