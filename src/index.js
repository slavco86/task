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

  function filterByPrice(priceRange, products) {
    const minPrice = parseFloat(priceRange[0])
    const maxPrice = parseFloat(priceRange[1])
    variants = []

    products.forEach(product => {
      product.variants.forEach(variant => {
        let variantPrice = parseFloat(variant.price)
        if(variantPrice >= minPrice && variantPrice <= maxPrice) {
          variants.push(variant)
        }
      })
    })
    return variants
  }

  function filterProducts(options, products) {
    let stock = products;
    let filteredProducts = [];
    filterByPrice(options.prices, stock).forEach(variant => {
      stock.forEach(product => {
        if(product.id === variant.product_id) {
          getCollection(product, filteredProducts)
        }
      })
    })
    // stock.forEach(product => {
    //   product.variants.forEach(variant => {
    //     if(parseFloat(variant.price) >= options.prices[0] || parseFloat(variant.price) <= options.prices[1]) {
    //       variants.push(variant)
    //     }
    //   })
    // })
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
    filterProducts({prices:['1.00','12.00']},products).forEach(product=> console.info(product))
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
