$(document).ready(function() {
  let products = []
  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      products.push(product)
    });
    console.info(products);
    return products
  }).then(products => {
    console.info(products.products)
    products.products.forEach(product => {
      $('#jsonData').append(`<li>${product.title}</li>`)
    });
  })
})
