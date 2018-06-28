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

  function filterProducts(options, products) {
    let filteredProducts = []
    products.forEach(product => {
      if (typeof options.prices !== 'undefined' || options.prices.length !== 0) {
        options.prices.forEach(price => {
          product.variants = product.variants.filter(variant => variant.price === price)
        })
      }
      if (product.variants.length > 0) {
        filteredProducts.push(product)
      }
    })
    return filteredProducts
  }

  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      products.push(product)
      getCollection(product.product_type.toLowerCase(), categories)
      product.variants.forEach(variant => {
        getCollection(variant.price, prices)
      })
      product.options.forEach(option => {
        if (option.name === 'SIZE') {
          option.values.forEach(value => {
            getCollection(value, sizes)
          })
        }
        if (option.name === 'Colour') {
          option.values.forEach(value => {
            getCollection(value.toLowerCase(), colors)
          })
        }
      })
    });
  })
  .then(() => {
    // console.info('Prices: ' + prices);
    // console.info('Sizes: ' + sizes);
    // console.info('Colours: ' + colors);
    // console.info('Categories: ' + categories);
    console.info('Filtered Products: ' + filterProducts({prices:['1.00','12.00']}, products))
    // products.forEach(product => {
    //   table.append(`
    //   <tr>
    //     <td>${product.title}</td>
    //     <td>${product.variants[0].price}</td>
    //     <td>
    //       ${product.variants[0].weight}
    //       ${product.variants[0].weight_unit}
    //     </td>
    //     <td>
    //       <img src="${product.image.src}"/>
    //     </td>
    //   </tr>`);
    // });
  })
})
