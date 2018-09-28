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
        console.log('featured list',response.data);
        // console.log('featured list id of space',response.data[0].spaceId);
        for (var i = response.data.length - 1; i >= 0; i--) {
            var temp_html =  
            
            '<div class="col-md-4 col-sm-6 col-12 ev-margin-top spaceitem-wrap" id="'+i+'" Space-item="'+response.data[i].spaceId+'" onClick="reply_click(this)">'+
                '<div class="ev-fea-item">'+
                    '<a  /*href="./space-detail.html"*/>'+
                       ' <div class="ev-fea-image-overlay-wrapper">'+
                            '<img src="'+response.data[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
                            '<div class="ev-fea-image-overlay">'+
                            '</div>'+
                        '</div>'+
                        '<div class="carousel-caption text-left" >'+
                            '<p class=" listName">'+response.data[i].name+'</p>'+
                            '<span >Learn More</span>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '</div>';

            $("#ev-featured-wrapper").append(temp_html);
            // var detailPage = [ response.data[i].name, response[i].Latitude, response[i].Longitude, response[i].VenueID ,response[i].Description, response[i].Images[0], response[i].Images[1], response[i].Street ];
            // detailPage.push(detailPage);
            // localStorage.setItem('detailPage', JSON.stringify(detailPage));
             
        }

    }
// ===================================================not yet working code start=============================   
        

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
                console.log('City Data ::',JSON.stringify(result))
                window.location.assign("./list.html")
            },
            error: function (error) {
                console.log("error",error);
            }
        });
    });

    var locations= [];

    function initMap() {
      var uluru = {lat: 12.8873182, lng: 77.6396559};
      var map = new google.maps.Map(
          document.getElementById('googleMap'), {zoom: 14, center: uluru});
     var marker = new google.maps.Marker({position: uluru, map: map});
    }
 
    if((localStorage.getItem('citiesData'))){
        var cityCentersData = JSON.parse((localStorage.getItem('citiesData')));
        console.log("Inside cityCentersData",cityCentersData);
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
                                '<a href="javascript:void(0);"  class="ev-primary-btn ev-list-item-cta-btn"> View More</a>'+
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

    if((localStorage.getItem('filterData'))){
        var filterData = JSON.parse((localStorage.getItem('filterData')));
        for (var i = filterData.length - 1; i >= 0; i--) {
            console.log("Inside cityCentersData",filterData[i]._id);
            localStorage.setItem('centerId', JSON.stringify(filterData[i]._id));
            var temp_html =  
            '<div class="col-md-6 col-sm-6 col-12 ev-margin-top">'+
                '<div class="ev-fea-item ev-list-item-wrapper">'+
                    '<a href="#">'+
                        '<img src="'+filterData[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
                        '<div class="ev-listing-item-caption text-left">'+
                            '<h3>'+filterData[i].spaceId.name+', '+filterData[i].spaceId.locality+'</h3>'+
                            '<p>'+filterData[i].spaceId.address1 +', '+filterData[i].spaceId.address2 +'</p>'+
                            '<div>'+
                                '<a href="javascript:void(0);" onclick="ShowOld();" class="ev-primary-btn ev-list-item-cta-btn"> View More</a>'+
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


    // console.log('From main.js', localStorage.getItem('roomDetails') )
  
    if (localStorage.getItem('roomDetails')){
        var roomDetailsData = JSON.parse((localStorage.getItem('roomDetails')));
        var description= roomDetailsData['description'];
        var amenities= roomDetailsData['amenities'];
        
        console.log('Amenities ::',amenities)

        // Description 
        var temp_html =  
        '<p class="ev-hotdsk-descp" >'+
            description+
        '</p>';
        $("#ev-hotdsk-descp-data").append(temp_html); 
        // Amenities
        for (var i = amenities.length - 1; i >= 0; i--) {
            var temp_html =  
            '<div class="row ev-adv-sec-row">'+
                '<div class="col-md-4 col-sm-6">'+
                    '<div class="row">'+
                        '<div class="col-md-3 col-sm-3 col-3">'+
                            '<img class="d-block w-100 ev-adv-icon" src="'+amenities[i].icon+'">'+
                        '</div>'+
                        '<div class="col-md-9 col-sm-9 col-9 no-padding">'+
                            '<h4 class="ev-adv-head">'+amenities[i].name+'</h4>'+
                            '<p class="ev-adv-body">Great building amenities covering all the required amenities.</p>'+
                        '</div>'+
                    '</div> '+
                '</div>'+
            '</div>';
            $("#ev-hotdsk-aminities-data").append(temp_html);    
        }
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
  

// =======================================workin on it=================================================


/*
  $( document ).ready(function() {
        console.log( "ready!" );
        if((localStorage.getItem('SpaceDetailId'))){
            var detailpageId = JSON.parse((localStorage.getItem('SpaceDetailId')));

            $.ajax({
            url: "http://mymatchbox.v1.idc.tarento.com/api/roomdetails/5b517c6c1d7e69255c20f8f0",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "GET",
            dataType: "json",
            success: function (result) {
                var spaceDetailInfo=result;
                console.log('got data as',result);
            },
            error: function () {
                console.log("error");
            }
        });
        });

        
        console.log("Inside detailpage console");
        var temp_html =  
          '<div class="">'+
            '<div id="MMBOffices" class="carousel slide" data-ride="carousel">'+
                '<ol class="carousel-indicators">'+
                    '<li data-target="#MMBOffices" data-slide-to="0" class="active"></li>'+
                    '<li data-target="#MMBOffices" data-slide-to="1"></li>'+
                    '<li data-target="#MMBOffices" data-slide-to="2"></li>'+
                '</ol>'+

                '<div class="carousel-inner">'+
                    '<div class="carousel-item active"> <img class="d-block w-100" src="assets/img/space-detail-banner.jpg"> </div>'+
                    '<!-- <div class="carousel-item"> <img class="d-block w-100" src="assets/img/banner-bg-2.png"> </div>'+
                    '<div class="carousel-item"> <img class="d-block w-100" src="assets/img/banner-bg-3.png"> </div> -->'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="container">'+
            '<div class="carousel-caption ev-caption-container">'+
                '<div class="row justify-content-center">'+
                    '<div class="col-12">'+
                        '<h1>WEWORK EGL, BENGALURU</h1>'+
                        '<p class="ev-sec-txt">Premium Coworking Space In EGL, Inner Ring Road, Bengaluru</p>'+
                    '</div>'+
                '</div>'+
                
            '</div>'+
        '</div> ';

        $("#ev-spaceDetailpage").append(temp_html);

    });*/

// =======================================workin on it=================================================

});