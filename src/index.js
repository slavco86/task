$(document).ready(function() {
  $.getJSON('data.json', function(data) {
    $('#jsonData').html(JSON.stringify(data));
  })
})
