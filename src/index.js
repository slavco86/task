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

  function filterByColours(colours, products) {
    const variants = []
    colours.forEach(colour => {
      products.forEach(product => {
        product.variants.forEach(variant => {
          if(variant.option2 === colour) {
            variants.push(variant)
          }
        })
      })
    })
    return variants
  }

  function filterBySizes(sizes, products) {
    const variants = []
    sizes.forEach(size => {
      products.forEach(product => {
        product.variants.forEach(variant => {
          if(variant.option1 === size) {
            variants.push(variant)
          }
        })
      })
    })
    return variants
  }

  function filterByCategory(categories, products) {
    const newProducts = []
    categories.forEach(category => {
      products.forEach(product => {
          if(product.product_type === category) {
            newProducts.push(product)
          }
      })
    })
    return newProducts
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

  function getProductsById (variants, stock) {
    let uniques = []
    variants.forEach(variant => {
      stock.forEach(product => {
        if(product.id === variant.product_id) {
          getCollection(product, uniques)
        }
      })
    })
    return uniques
  }

  function filterProducts(options, products) {
    let stock = products;
    const result = []
    let filteredProducts = [];
    filteredProducts.push(getProductsById(filterByPrice(options.prices, stock), stock))
    filteredProducts.push(getProductsById(filterByColours(options.colours, stock), stock))
    filteredProducts.push(getProductsById(filterBySizes(options.sizes, stock), stock))
    filteredProducts.push(filterByCategory(options.categories, stock))
    filteredProducts.forEach(collection => {
      collection.forEach(product => {
        getCollection(product, result)
      })
    })
    return result
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
    filterProducts({
        prices:['10.00','12.00'],
        colours:["BLACK","RED"],
        sizes:["6","10"],
        categories:["SWIMWEAR"]
      },products)
    .forEach(product=> console.info(product))
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
