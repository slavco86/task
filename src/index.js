$(document).ready(function() {
  const products = []
  const table = $('#jsonData')
  const prices = []
  const colors = []
  const categories = []

  function getVariants(variants) {
    console.info(variants)
    if (variants.length > 0) {
    }
  }

  function getCollection(value, array) {
    if ($.inArray(value, array) === -1) {
      array.push(value)
    }
  }

  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      products.push(product)
      // console.info(product.variants.length)
      if (product.variants.length > 1) {
        product.variants.forEach(variant => {
          getCollection(variant.price, prices)
          // console.info(prices);
        })
      } else {
        getCollection(product.variants[0].price, prices);
      }

    });
  })
  .then(() => {
    console.info(prices);
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
