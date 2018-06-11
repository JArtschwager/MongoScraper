// Grab the articles as a json
$(document).on("click", ".banner", function() {
//gets all of the options to display.
$.getJSON("/all", function(data) {
    for (var i = 0; i < data.length; i++) {
      // Display the info on the index page
      $("#craftsPulled").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
});

//when p clicked
$(document).on("click", "p", function() {
  // Empty the notes
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // ajax call for the crafts list
  $.ajax({
    method: "GET",
    url: "/all/" + thisId
  })
    // add the note info to the page
    .then(function(data) {
      //*LINE BELOW IS WHERE MY CODE IS BREAKING. 
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<h4>note title</h4> <input id='titleinput' name='title' >");
      $("#notes").append("<h4>Details</h4> <textarea id='bodyinput' name='body'></textarea>");
      //  submit button a new note
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note 
      if (data.note) {
        // title added
        $("#titleinput").val(data.note.title);
        // body added
        $("#bodyinput").val(data.note.body);
      }
    });
});

//copied from example - test once notes start to show up.  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("_id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/Crafts/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");


  });
  

