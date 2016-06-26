var domain = "https://quiet-bastion-96093.herokuapp.com";

$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);
  
  /** Creates a buy request with the server */   
  $("#Page_center").on('click',".dropdown-content a",function() {
    event.preventDefault();
    var my_id = $(this).parent().siblings(".page_center_buy").attr("id");
    console.log("buy item "+ my_id);
    $.ajax({
      method: 'POST',
      url: domain +'/cart/'+ my_id +'/'+ $(this).html(),
      dataType: 'html',
      data: { iid: my_id, size: "Medium" }
     }).then(function(data) { 
     }).done(function (msg){
      console.log(my_id +" leads to "+ msg);
      alert("Purchase added to your cart!");
      $(this).background-color: green;
    }).fail(function( xhr, status, errorThrown ) {
      errorLog(xhr,status,errorThrown);
      onServerError("Could not purchase this item! "+xhr.responseText);
    });
    return false;
  });
  
  
  $("#Page_center").on('click',"#checkout",function() {
    event.preventDefault();
    console.log("checkout");
    $.ajax({
      method: 'POST',
      url: domain +'/cart/checkout/'+ my_id,
      dataType: 'json'
     }).then(function(data) { 
     }).done(function (msg){
      console.log(my_id +" leads to "+ msg);
      alert("Thank-you for your purchase!");
    }).fail(function( xhr, status, errorThrown ) {
      errorLog(xhr,status,errorThrown);
      onServerError("Could not check out! "+xhr.responseText);
    });
    return false;
  });
  
  /** Changes the category based on clicks in the sidebar */
  $("a").click(function(event) {
    if (!($(this).hasClass("menu_item"))) {
      return; // if this isn't a menu item, continue with whatever you were doing
    }
    // otherwise, stop link propagation
    event.preventDefault();
    console.log("change category "+$(this).attr("href"));
    $.ajax({
      method: 'GET',
      url: domain+"/shop/"+($(this).attr("href"))
    }).then(function(data) { 
      make_table(data);
    }).done(function (data) {
    }).fail(function( xhr, status, errorThrown ) {
      errorLog(xhr,status,errorThrown);
    });
    return false;
  });
 
});
  
  
  
// AUXILIARY FUNCTIONS
// =========================================================
/** Gets all the items from the server, turns them into HTML and inserts them into the document. */
var load_all  = function() {
  console.log("Get all ");
  $.ajax({
    method: 'GET',
    url: domain+'/shop/all'
  }).then(function(data) {
    make_table(data)
  }).done( function(data) {
  }).fail(function( xhr, status, errorThrown ) {
    // Code to run if the request fails; the raw request and
    // status codes are passed to the function
    alert("Sorry, there was a problem accessing the database!");
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    onServerError(xhr);
  });
}

/** Gets all the items from the cart, turns them into HTML and inserts them into the document. */
var load_cart  = function() {
  console.log("Get cart ");
  $.ajax({
    method: 'GET',
    url: domain+'/cart/all/' // TODO get logged in info from cookies
  }).then(function(data) {
    show_cart(data)
  }).done( function(data) {
  }).fail(function( xhr, status, errorThrown ) {
    // Code to run if the request fails; the raw request and
    // status codes are passed to the function
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    onServerError(xhr);
  });
}

var errorLog = function(xhr, status, errorThrown) {
  console.log( "Error: "+ errorThrown);
  console.log( "Status: "+ status);
  if (status < 500) {
    onClientError(xhr.responseText);
  } else {
    onServerError(xhr);
  }
}

/** Just a prettiness thing--shows a client error*/
var onClientError = function(xhr) {
  $("#page_top_server").animate({ 
    opacity: 0
  }, 200 );
  $("#page_top_content").animate({ 
    opacity: 0
  }, 200 );
  $("#page_top_client").html(text);
  $("#page_top_client").css("display","block");
  $("#page_top_client").animate({
    opacity: 1
  }, 200, function() {
    // on complete
  });
  switch (xhr.status) {
    case 404: alert("The requested page could not be found, sorry!");
                break;
    case 403: alert("Please log in to access this page!");
                break;
    default: alert("Status error "+ xhr.status);    
  }
}

/** Just a prettiness thing--shows a server error*/
var onServerError = function(xhr) {
  $("#page_top_content").animate({ 
    opacity: 0
  }, 200 );
  $("#page_top_client").animate({ 
    opacity: 0
  }, 200 );
  $("#page_top_server").html(text);
  $("#page_top_server").css("display","block");
  $("#page_top_server").animate({
    opacity: 1
  }, 200, function() {
    // on complete
  });
  switch (xhr.status) {
    case 500: alert("The server has encountered an unexpected issue with your request, please try again.");
                break;
    default: alert("The server is experiencing difficulties, please try again.");    
  }
}

/* uses html_data's <td> objects to create a table, with rows and stuff. */
var make_table = function (data) {
  $("#Page_center").find("tbody").html("");
  var html_data_arr = html_data(data);
  var trs = $("#Page_center").find("tbody");
  var last_idx = trs.length - 1;
  for (var i = 0; i < html_data_arr.length; i++) {
    if (i % 3 == 0) {
      trs.append("<tr>");
    }
    //console.log("\trow! ",i);
    trs.append(html_data_arr[i]);
    if (i % 3 == 2) {
      trs.append("</tr>");
    }
  }
}


/** Returns an array of <td> objects. */
var html_data = function (data) {
  var arr = new Array();
  for (var i = 0; i < data.length; i++) {
    var html = "<td width=\"35\" class=\"page_center_button\" style=\"border-left: 1px lightgrey dotted;\">";
        html+= "<div class=\"dropdown\">"
          html+= "<a class=\"page_center_buy\" id=\""+ data[i].iid +"\" title=\"Buy "+data[i].name +"\"></a>";
        if (!(data[i].subcategory === "Jewellery" || data[i].subcategory === "Watches")) {
          html+= "<div class=\"dropdown-content\">"
                      +"<a href=\"javascript.void(0);\">Small</a>"
                      +"<a href=\"javascript.void(0);\">Medium</a>"
                      +"<a href=\"javascript.void(0);\">Large</a>"
                      +"<a href=\"javascript.void(0);\">X Large</a>"
                    +"</div>";
        }
        html+= "</div>";
        html+= "<a class=\"page_center_info\" href=\"?page=home\" title=\"more info\"><span>more-info</span></a>";
        html+= "</td>";
        html+= "<td width=\"174\" class=\"page_center_content\" valign=\"top\">";
          html += "<img width=\"174\" src=\"images/"+ (data[i].image) +".jpg\" />";
          html += "<div class=\"page_center_text\">";
            html += "<p><span class=\"item_name blue2\" id=\""+ data[i].iid +"\">";
              html += data[i].name;
            html += "</p>";
            if (typeof(data[i].description) !== 'object') {
              html += "<p><span class=\"item_description gray\">"+ data[i].description +"</span></p>";
            }
            html += "<span class=\"item_price green\">Price: $"+ money(data[i].price) +"</span><br>";
          html += "</div>";
        html += "</td>";
    arr.push(html);
  }
  return arr;
}

/** Returns an array of <td> objects. */
var html_cart_data = function (data) {
  var arr = new Array();
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    total += (Number(data[i].quantity) * Number(data[i].price));
    var html = "<td>";
        html+= data[i].name;
        html+= "</td>";
        html+= "<td>";
          html += data[i].size;
        html += "</td>";
        html += "<td>";
          html += data[i].quantity;
        html += "</td>";
        html += "<td>";
          html += data[i].price;
        html += "</td>";
        html += "<td>";
        html += "<span class=\"item_description gray\"><a href=\"/cart/delete/"+
                      data[i].iid+"/"+data[i].size+"\"> X </a></span>";
        html += "</td>";
    arr.push(html);
  }
  arr.push("<td id=\"name_\"></td> <td id=\"size_\"></td> <td id=\"quantity_\"><a href=\"javascript.void(0);\" id=\"checkout\">Checkout</a></td> <td id=\"total_\">$"+ money(total) +"</td> <td id=\"removeall_\"><a class=\"remove-all\" href=\"javascript.void(0);\">Remove all</td>");
  return arr;
}

/* uses html_data's <td> objects to create a table showing the user's cart. */
var show_cart = function (data) {
  $("#Page_center").find("tbody").html(""); // clear the page body
  var html_data_arr = html_cart_data(data);
  var trs = $("#Page_center").find("tbody");
  var last_idx = trs.length - 1;
  trs.append("<tr class=\"cart-header\"><td width=\"40%\">Name</td><td width=\"15%\">Size</td><td width=\"10%\">Quantity</td><td width=\"10%\">Price</td><td width=\"5%\">Remove</td></tr>");
  for (var i = 0; i < html_data_arr.length; i++) {
    trs.append("<tr>");
    trs.append(html_data_arr[i]);
    trs.append("</tr>");
  }
}


// rounding technique from: http://jsfiddle.net/FQTqk/7/
var money = function(value) {
  return parseFloat(Math.round(value * 100) / 100).toFixed(2);
}
