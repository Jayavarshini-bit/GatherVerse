$(document).ready( function(){

    //check the browser console to see status message when page loads.
    console.log("ready");

    //hide the entry form by default
    $("#entry-form").hide();

    $("#search-button").click(function(){
        $("#entry-form").hide(500);
        //get the search term from the input text box.
        var searchTerm = $("#searchTerm").val();

        console.log("You searched for "+ searchTerm);

        $.ajax(
        {
            //Rest controller url
            url: "http://localhost:8080/api/v1/orders/search/"+searchTerm,

            //callback function runs after the server responds.
            success: function(result)
            {
                console.log(result);

                //concatenate elements to display.
                var outputHTML="";
                for(var x = 0; x<result.length; x++){
                    var order = result[x];
                    outputHTML +="<div class='single-order'><ul>";
                    outputHTML +="<li>Id:"+ order.id + "</li>";
                    outputHTML +="<li>Date: "+ order.orderNo + "</li>";
                    outputHTML +="<li>EventName: "+ order.productName + "</li>";
                    outputHTML +="<li>Price: "+ order.price + "</li>";
                    outputHTML +="<li>Place: "+ order.quantity + "</li>";
                    outputHTML +="</ul>" ;
                    /*outputHTML +="<button class= 'edit-button btn btn-secondary' value ='"+order.id +"'>Edit</button>";
                    outputHTML +="<button class= 'delete-button btn btn-primary' value ='"+order.id +"'>Delete</button>";*/
                    outputHTML +="</div>";
                }
                //replace the contents of the <div results-box> with the generated results
                $("#results-box").html(outputHTML);
            }
        });

    });

    $(document).on("click",".edit-button",function(){
        //get the item number that was clicked
        const editIdNumber = $(this).val();
        console.log(editIdNumber);

        $.ajax(
            {
                url:"http://localhost:8080/api/v1/orders/"+editIdNumber,
                type:'GET',
                success: function(result)
                {
                    console.log("Editing Order:",result);

                    //fill the data entry form with the results from the database.
                    $("#orderId").val(result.id);
                    $("#ordernumber").val(result.orderNo);
                    $("#ordereventname").val(result.productName);
                    $("#orderprice").val(result.price);
                    $("#orderquantity").val(result.quantity);

                    //make the form visible. animate 500ms.
                    $("#entry-form").show(50);
                }
            });

    });
    $("#form-ok").click(function(){
        var obj = new Object();
        obj.id = $("#orderId").val();
        obj.orderNo = $("#ordernumber").val();
        obj.productName = $("#orereventname").val();
        obj.price = $("#orderprice").val();
        obj.quantity = $("#orderquantity").val();

        var jsonString = JSON.stringify(obj);
        console.log("jsonstring", jsonString);

        $.ajax(
            {
                type:'PUT',
                url:"http://localhost:8080/api/v1/orders/update/"+obj.id,
                //configure the request to expect a json request body.
                contentType:'application/json',
                data: jsonString,
                dataType:'json',
                success: function(data){
                //nothing to display. Console log for testing.
                    console.log(data);
                },
                error: function(e){
                    console.log(e);
                },
            });
            $("#entry-form").hide(500);

            //clear the search results since information is out of data.
            $("#results-box").html("");
    });

    $(document).on("click",".delete-button",function(){
        const deleteIdNumber = $(this).val();
        console.log(deleteIdNumber);
        $.ajax({
            type:'DELETE',
            url:"http://localhost:8080/api/v1/orders/"+deleteIdNumber,
            success:function(data){
                console.log(data);
            },
            error: function(e){
                console.log(e);
            },
        });

        //clear the search results box since information is now out of data.
        $("#results-box").html("");
    });

});