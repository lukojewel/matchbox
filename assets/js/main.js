$( document ).ready(function() {

    var featuredSpacesData, cityInventoryData, spaceTypeData;
    var featuredSpacesUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/featuredSpaces";
    var cityInventoryUrl = "http://mymatchbox.v1.idc.tarento.com/api/v2/getCityInventory";

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
                        '<img src="'+response.data[i].images[0].url+'"  width="100%" height="216" class="img-fluid" alt="Image | Featured Space 1"/>'+
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
    }

    $("#ev-banner-find-btn").click(function() {
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
            data: {"lon": "77.63615519999996", "lat": "12.9265132"},
            success: function (result) {
                console.log(result);
                localStorage.setItem('citiesData', JSON.stringify(result));
                window.location.assign("file:///C:/Users/Team%20Evoque/Desktop/my%20match%20box%20-%20Git/list.html")
            },
            error: function () {
                console.log("error");
            }
        });
    });



    if((localStorage.getItem('citiesData'))){
        var cityCentersData = JSON.parse((localStorage.getItem('citiesData')));
        console.log(cityCentersData);
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
        }
        // localStorage.clear();
    }
    



});