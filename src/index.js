$(document).ready(function() {
  const products = []
  const table = $('#jsonData')
  const prices = []
  const colors = []
  const sizes = []
  const categories = []

  function getCollection(value, array) {
    if ($.inArray(value, array) === -1) {
      array.push(value)
    }
  }

  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      products.push(product)
      product.variants.forEach(variant => {
        getCollection(variant.price, prices)
      })
      product.options.forEach(option => {
        if (option.name === 'SIZE') {
          option.values.forEach(value => {
            getCollection(value, sizes)
          })
        }
      })

    });
  })
  .then(() => {
    console.info('Prices: ' + prices);
    console.info('Sizes: ' + sizes);
    products.forEach(product => {
      table.append(`
      <tr>
        <td>${product.title}</td>
        <td>${product.variants[0].price}</td>
        <td>
          ${product.variants[0].weight}
          ${product.variants[0].weight_unit}
        </td>
        <td>
          <img src="${product.image.src}"/>
        </td>
      </tr>`);
    });
  })
})
