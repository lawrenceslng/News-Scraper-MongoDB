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
                var commentButton = $("<button type='button' class='btn btn-primary comment' data-toggle='modal' data-target='#exampleModal'> ").text("Add a Comment");
                newDiv.html("<h5>"+data[i].title+"</h5> <span>"+data[i].summary+"</span> \n <a href = " + data[i].link+">Article Link</a> \n");
                newDiv.append(saveButton);
                newDiv.append(commentButton);
                $(".results").prepend(newDiv);
            }
        }  
    });
}
  
// Runs the getResults function as soon as the script is executed
getResults();
  
//this function will pop a modal box so that users can leave a comment and their name for a particular article
// $(document).on("click", ".comment", function() {

// });
//MAKE A FUNCTION THAT WHEN YOU CLICK ON A SAVE UBTTON, IT SAVES THAT ARTICLE OBJECT's INTO A NEW COLLECTION
// When the #make-new button is clicked
