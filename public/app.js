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
                console.log(data[i].comment.length);
                var newDiv = $("<div>").attr("data-id", data[i]._id);
                var saveButton = $("<button class='save'>").text("Save this Article");
                if(data[i].comment.length == 0)
                {
                    var comments =  $("<span>No Comments for this article</span>");
                }
                else
                {
                    var comments = $("<span>");
                    for(var j = 0; j < data[i].comment.length; j++)
                    {
                        console.log(data[i].comment[j]);
                        //
                        comments.append("<ul class = 'comment' id="+j+">"+data[i].comment[j]+"<button class='delete btn btn-danger' id="+j+">X</button></ul>");
                        // comments.append("<button class='delete btn btn-danger' id="+j+">X</button><br>");
                    }
                }
                
                var commentForm = $("<form>");
                // var commentButton = $("<button type='button' class='btn btn-primary comment'>").text("View/Add a Comment");
                var commentTextBox = $("<div class='form-group'><label for='commentTextArea'>Example textarea</label><textarea class='form-control' name='comment' id='commentTextArea' rows='3'></textarea></div>");
                var commentSubmitButton = $("<button class='submit btn btn-primary'>").text("Add a Comment");
                newDiv.html("<h5>"+data[i].title+"</h5> <span>"+data[i].summary+"</span> <br> <a target='_blank' rel='noopener noreferrer' href = " + data[i].link+">Article Link</a>");
                newDiv.append(saveButton);
                // newDiv.append(commentButton);
                commentForm.append(commentTextBox);
                commentForm.append(commentSubmitButton);
                newDiv.append(commentForm);
                newDiv.append(comments);
                $(".results").prepend(newDiv);
            }
        }  
    });
}
  
// Runs the getResults function as soon as the script is executed
getResults();
  
//function to get route that executes cheerio and grabs headlines from SF Chron
$(".scrape").on("click", function() {
    
    $.ajax({
        type: "GET",
        url: "/bay_area_news",
        // On a successful call, clear the #results section
        success: function(response) {
            setTimeout(getResults, 3000);
        }
    });
});
// When the #clear-all button is pressed
$(document).on("click",".clear",function(){
    // Make an AJAX GET request to delete the notes from the db
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

//this on click function will post the comment to the appropriate article's obj in Mongo
$(document).on("click", ".submit", function(e) {
    e.preventDefault();
    console.log("comment saving");
    var comment = $(this).parent().find("#commentTextArea").val();
    console.log(comment);
    var element = $(this).parents("div");
    element = $(element).attr("data-id");
    console.log(element);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/comment/"+ element,
        data: {
          comment: comment
        },
        success: function(data) {
            getResults();
        }
      })
    //   // If that API call succeeds, add the comment to page
        // .then(function(data) {
        //     console.log("returning");
        //     $(".results").prepend("<span>Comment added</span>")
        // });
    // $("#commentForm").attr("method","POST");
    // $("#commentForm").attr("action","/comment");
    // $("#commentForm").submit();
});

// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
    // Save the p tag that encloses the button
    var selected = $(this).parent();
    var articleId = $(this).parents("div").attr("data-id");
    console.log(articleId);
    var commentId = $(this).attr("id");
    console.log(commentId);
    var comment = $(this).parent().text();
    comment = comment.substring(0,comment.length-1);
    console.log(comment);
    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
      type: "GET",
      url: "/delete/" + articleId + "/" + comment,
  
      // On successful call
      success: function(response) {
        // Remove the p-tag from the DOM
        selected.remove();
        console.log("comment " + commentId + " removed");

      }
    });
  });

//potential function to hide comments and comment box
// $(document).on("click",".comment",function(event){
//     if($(this).parent().children("form").children("textarea").hasClass("d-none"))
//     {
//         $(this).parent().children("form").children("textarea").removeClass("d-none");
//         $(this).parent().children("form").children(".submit").removeClass("d-none");
//     }
//     else{
//         $(this).parent().children("form").children("textarea").addClass("d-none");
//         $(this).parent().children("form").children(".submit").addClass("d-none");
//     }
    
// })
//MAKE A FUNCTION THAT WHEN YOU CLICK ON A SAVE UBTTON, IT SAVES THAT ARTICLE OBJECT's INTO A NEW COLLECTION
// When the #make-new button is clicked
