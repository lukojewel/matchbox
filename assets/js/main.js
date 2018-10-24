$( document ).ready(function() {

    var featuredSpacesData, cityInventoryData, spaceTypeData, testimonialsData;
    var featuredSpacesUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/featuredSpaces";
    var cityInventoryUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/getCityInventory";
    var testmonialsUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/testimonial";
    var map;

    getRequest(featuredSpacesUrl, featuredSapces);
    getRequest(cityInventoryUrl, cityInventory);
    getRequest(testmonialsUrl, testimonials);

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

    function testimonials(response){
        testimonialsData= response;
        for (var i = response.data.length - 1; i >= 0; i--) {
            var temp_html =  
            '<div class="carousel-item active">'+
                '<div class="row justify-content-center">'+
                    '<div class="col-sm-8 text-center">'+
                        '<p class="ev-testimonial">'+response.data[i].description+'</p>'+
                        '<img class="ev-img" src="'+response.data[i].image+'"   width="86" height="86" alt="Image | User Name"/>'+
                        '<p class="ev-name">'+response.data[i].name+'</p>'+
                        '<p class="ev-company">'+response.data[i].organization+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>';

            $("#testimonials").append(temp_html);     
        }
    }

    function featuredSapces(response){
        featuredSpacesData= response;
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
        }
    };
 
    function cityInventory(response){
        cityInventoryData= response.data.cities;
        spaceTypeData = response.data.inventories;
        for (var i = response.data.cities.length - 1; i >= 0; i--) {
            $('#cities').append('<option lat="'+response.data.cities[i].lat+'" city="'+response.data.cities[i].city+'" lng="'+response.data.cities[i].lng+'" value="'+response.data.cities[i].cityValue+'">'+response.data.cities[i].city+'</option>');
        }

        for (var i = response.data.inventories.length - 1; i >= 0; i--) {
            $('#space-type').append('<option value="'+response.data.inventories[i].roomType+'">'+response.data.inventories[i].roomType+'</option>');
        }
        
        if ($("body").find(".ev-usp-container").length !== 0) {
          $('select').niceSelect();
        }
    }

    $("#ev-banner-find-btn").click(function(event) {
        event.preventDefault();
        roomListAPI();
    });

    $(".ev-list-type-select-box").on('change', function() {
      roomListAPI();
    });


    function roomListAPI(){
        localStorage.clear();
        var tempSelectbox = $("#cities").find('option:selected'); 
        var tempSelectboxAttrcity = tempSelectbox.attr("city");
        var tempSelectboxAttrroomType = $( "#space-type option:selected" ).text();
         $.ajax({
            url: "http://mymatchbox.v1.idc.tarento.com/api/v2/getAvailableSpaces",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            dataType: "json",
            data:{"roomType":tempSelectboxAttrroomType, "city":tempSelectboxAttrcity,"timeZoneOffset":-330},
            success: function (result) {
                localStorage.clear();
                if(result.totalSearchedRooms != 0){
                    localStorage.setItem('citiesData', JSON.stringify(result));
                    window.location.assign("./list.html");
                }
                else{
                    window.location.assign("./list.html");
                }
            },
            error: function (error) {
                console.log("error",error);
            }
        });
    };

    if(localStorage.getItem('citiesData')){
        var cityCentersData = JSON.parse((localStorage.getItem('citiesData')));
        for (var i = cityCentersData.rooms.length - 1; i >= 0; i--) {
            var temp_html =  
            '<div class="col-md-6 col-sm-6 col-12 ev-margin-top" Room-id="'+cityCentersData.rooms[i]._id+'" >'+
                '<div class="ev-fea-item ev-list-item-wrapper">'+
                    '<a href="#">'+
                        '<img src="'+cityCentersData.rooms[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
                        '<div class="ev-listing-item-caption text-left">'+
                            '<h3>'+cityCentersData.rooms[i].name+', '+cityCentersData.rooms[i].spaceId.locality+'</h3>'+
                            '<p>'+cityCentersData.rooms[i].description+'</p>'+
                            '<div>'+
                                '<a href="javascript:void(0);" Room-id="'+cityCentersData.rooms[i]._id+'" class="ev-primary-btn ev-list-item-cta-btn" > View More</a>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '</div>';

            $("#ev-center-list").append(temp_html);
        }
    };

    $(".ev-list-item-cta-btn").click(function(event) {
        event.preventDefault();
        var centerId = $(this).attr("Room-id");
        $.ajax({
            url: 'http://mymatchbox.v1.idc.tarento.com/api/roomdetails/'+centerId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "GET",
            dataType: "json",
            success: function (result) {
                localStorage.setItem('roomDetails', JSON.stringify(result));
                window.location.assign("./space-detail.html")
            },
            error: function () {
                console.log("error");
            }
        });
    });

    if (localStorage.getItem('roomDetails')){
        var roomDetailsData = JSON.parse((localStorage.getItem('roomDetails'))); 
        var description= roomDetailsData.description;
        var spaceName=roomDetailsData.name;
        var address1=roomDetailsData.spaceId.address1;
        var address2=roomDetailsData.spaceId.address2;
        var amenities= roomDetailsData.amenities;

        /* Title */ 
        var temp_html =  
        '<h1 >'+spaceName+'</h1>'+
        '<p class="ev-sec-txt">'+address1+' , '+address2+'</p>';
        $("#space_detail_banner_head").append(temp_html); 

        /* Description */ 
        var temp_html =  
        '<p class="ev-hotdsk-descp" >'+description+'</p>';
        $("#ev-hotdsk-descp-data").append(temp_html); 
        
       /* Amenities */ 
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
    
});