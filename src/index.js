$(document).ready(function() {
  let productCol = []
  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      productCol.push(product)
    });
  })
  .then(() => {
    productCol.forEach(product => {
      $('#jsonData').append(`<li>${product.title}</li>`)
    });
  })
  .then()
})
