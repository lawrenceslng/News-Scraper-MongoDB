// Loads results onto the page
function getResults() {
    // Empty any results currently on the page
    $(".results").empty();
    // Grab all of the current 
    $.getJSON("/database", function(data) {
        // For each note...
        if(data.length == 0){
            var newDiv = $("<div>").text("Looks like there is no news. Click above button to scrape news article!");
            $(".results").append(newDiv);
        }
        else{
            for (var i = 0; i < data.length; i++) {
                var newDiv = $("<div>").attr("data-id", data[i]._id);
                newDiv.html("<h5>"+data[i].title+"</h5> <span>"+data[i].summary+"</span> \n <a href = " + data[i].link);
                $(".results").prepend(newDiv);
            }
        }  
    });
}
  
// Runs the getResults function as soon as the script is executed
getResults();
  