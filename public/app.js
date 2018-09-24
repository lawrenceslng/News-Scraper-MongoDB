// Loads results onto the page
function getResults() {
    // Empty any results currently on the page
    console.log("emptying results");
    $(".results").empty();
    // Grab all of the current 
    $.getJSON("/database", function(data) {
        // For each note...
        console.log("making a choice");
        if(data.length == 0){
            var newDiv = $("<div>").text("Looks like there is no news. Click above button to scrape news article!");
            $(".results").append(newDiv);
        }
        else{
            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>").attr("data-id", data[i]._id);
                var saveButton = $("<button class='save'>").text("Save this Article");
                var comments = $("<span>"+data[i].comments+"</span>");
                var commentForm = $("<form>");
                var commentButton = $("<button type='button' class='btn btn-primary comment'>").text("View/Add a Comment");
                var commentTextBox = $("<textarea class='d-none' rows='2' placeholder='Put your Comment Here!'>");
                var commentSubmitButton = $("<button class='submit d-none btn btn-primary'>").text("Add a Comment");
                newDiv.html("<h5>"+data[i].title+"</h5> <span>"+data[i].summary+"</span> <br> <a href = " + data[i].link+">Article Link</a>");
                newDiv.append(saveButton);
                newDiv.append(commentButton);
                commentForm.append(commentTextBox);
                commentForm.append(commentSubmitButton);
                newDiv.append(commentForm);
                $(".results").prepend(newDiv);
            }
        }  
    });
}
  
// Runs the getResults function as soon as the script is executed
getResults();
  
// When the #clear-all button is pressed
$(".scrape").on("click", function() {
    // Make an AJAX GET request to delete the notes from the db
    $.ajax({
        type: "GET",
        url: "/bay_area_news",
        // On a successful call, clear the #results section
        success: function(response) {
            setTimeout(getResults, 3000);
        }
    });
});

$(document).on("click",".clear",function(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clear",
        // On a successful call, clear the #results section
        success: function(response) {
          $(".results").empty();
          getResults();
        }
      });
})

//this function will pop a modal box so that users can leave a comment and their name for a particular article
$(document).on("click", ".submit", function(e) {
    e.preventDefault();
    console.log("comment saving");
    var element = $(this).parents("div");
    element = $(element).attr("data-id");
    console.log(element);


    // $.ajax({
    //     type: "POST",
    //     dataType: "json",
    //     url: "/comment",
    //     data: {
    //       title: $("#title").val(),
    //       note: $("#note").val(),
    //       created: Date.now()
    //     }
    //   })
    //   // If that API call succeeds, add the title and a delete button for the note to the page
    //     .then(function(data) {
    //     // Add the title and delete button to the #results section
    //       $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
    //       data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
    //       // Clear the note and title inputs on the page
    //       $("#note").val("");
    //       $("#title").val("");
    //     });
    // $("#commentForm").attr("method","POST");
    // $("#commentForm").attr("action","/comment");
    // $("#commentForm").submit();
});

$(document).on("click",".comment",function(event){
    if($(this).parent().children("form").children("textarea").hasClass("d-none"))
    {
        $(this).parent().children("form").children("textarea").removeClass("d-none");
        $(this).parent().children("form").children(".submit").removeClass("d-none");
    }
    else{
        $(this).parent().children("form").children("textarea").addClass("d-none");
        $(this).parent().children("form").children(".submit").addClass("d-none");
    }
    
})
//MAKE A FUNCTION THAT WHEN YOU CLICK ON A SAVE UBTTON, IT SAVES THAT ARTICLE OBJECT's INTO A NEW COLLECTION
// When the #make-new button is clicked
