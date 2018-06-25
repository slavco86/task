$(document).ready(function() {
  $.getJSON('https://jkq0dchnp0.execute-api.eu-west-1.amazonaws.com/dev/get-json-data', function(data) {
    $('.jsonData').html(JSON.stringify(data));
  })
})
