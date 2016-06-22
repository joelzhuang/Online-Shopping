$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);
  //var domain = "https://localhost:6400";
  var domain = "https://quiet-bastion-96093.herokuapp.com";
  console.log('Page ready!');
    get_items();
  
    /** Creates a buy request with the server */
  $("#Page_center").on('click',".page_center_buy",function() {
    console.log("buy item "+$(this).attr("id"));
    $.ajax({
      method: 'POST',
      url: domain +'/'+ $(this).attr("id") +'/Medium',
      dataType: 'json',
      data: { iid: $(this).attr("id"), uid: 10, size: "Medium" } // TODO actually get an id for user 
    }).done(function (msg){
      console.log(data +" leads to "+ msg);
      alert("purchase made");
     }).fail(function( xhr, status, errorThrown ) {
      // Code to run if the request fails; the raw request and
      // status codes are passed to the function
      alert( "Sorry, there was a problem accessing the database!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
    });
    return false;
  });
  
    /** Changes the category */
  $("a").click(function(event) {
  // if this isn't a menu item continue with whatever you were doing
    if (!($(this).hasClass("menu_item"))) {
      return;
    }
    // otherwise, stop link propagation
    event.preventDefault();
    event.stopImmediatePropagation();
    console.log("change category "+$(this).attr("href"));
    
    $.ajax({
      method: 'GET',
      url: domain+"/"+($(this).attr("href")),
      dataType: 'json',
    }).then(function(data) {
    }).done(function (data) {
      console.log(data +" leads to "+ data);
      $("Page_center")
      make_table(data);      
     }).fail(function( xhr, status, errorThrown ) {
      // Code to run if the request fails; the raw request and
      // status codes are passed to the function
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
    });
    return false;
  });
  
  /** Gets all the items from the server, turns them into HTML
  and inserts them into the document. */
  function get_items() {
    console.log("Get all ");
    $.ajax({
      method: 'GET',
      url: domain+'/all'
    }).then(function(data) {
      make_table(data)
    }).done( function(data) {
    }).fail(function( xhr, status, errorThrown ) {
      // Code to run if the request fails; the raw request and
      // status codes are passed to the function
      alert("Sorry, there was a problem accessing the database!");
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    });
  }
  
  /* uses html_data's <td> objects to create a table, with ross and stuff. */
  var make_table = function (data) {
    $("#Page_center").find("tbody").html("");
    var html_data_arr = html_data(data);
    var trs = $("#Page_center").find("tbody");
    var last_idx = trs.length - 1;
    for (var i = 0; i < html_data_arr.length; i++) {
      if (i % 3 == 0) {
        trs.append("<tr>");
      }
      console.log("\trow! ",i);
      trs.append(html_data_arr[i]);
      if (i % 3 == 2) {
        trs.append("</tr>");
      }
    }
  }
  
  /** Returns an array of <td> objects. Currently, every third cell is 
  the website's default middle column, but we can change/remove this. */
  var html_data = function (data) {
  console.log("hello yes I am data "+data);
    var arr = new Array();
    for (var i = 0; i < data.length; i++) {
      var html = "<td width=\"29\" class=\"page_center_button\">";
          html+= "<a class=\"page_center_buy\" id=\""+ data[i].iid +"\" title=\"Buy "+data[i].name +"\"></a>";
          html+= "<a class=\"page_center_info\" href=\"?page=home\" title=\"more info\"><span>more-info</span></a>";
          html+= "</td>";
          html+= "<td width=\"180\" class=\"page_center_content\" valign=\"top\">";
            html += "<img width=\"180\" src=\"images/"+ (data[i].image) +".jpg\" />";
            html += "<div class=\"page_center_text\">";
              html += "<p><span class=\"item_name blue2\" id=\""+ data[i].iid +"\">";
                html += data[i].name;
              html += "</p>";
              html += "<p><span class=\"item_description gray\">"+ data[i].description +"</span></p>";
              html += "<span class=\"item_price green\">Price: $"+ data[i].price +"</span><br>";
            html += "</div>";
          html += "</td>";
      arr.push(html);
    }
    return arr;
  }
  
  
});

/*

item cell format: 
<td width="29" class="page_center_button">
  <a class="page_center_buy" href="?page=home" title="buy"><span>buy</span></a>
  <a class="page_center_info" href="?page=home" title="more info"><span>more-info</span></a>
</td>
<td width="178" class="page_center_content">
  <div class="page_center_text">
    <p><span class="item_name blue2" id="<item id>">Lorem ipsum dolor</span></p>
    <p><span class="item_description gray">Donec at: justo ac</span></p>
    <span class="item_price green">Price: $156</span><br>
  </div>
</td>

*/
