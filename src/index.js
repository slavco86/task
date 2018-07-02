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
    colours.forEach(colour => {
      products.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.option2.toLowerCase() === colour.toLowerCase()) {
            variant.colourMatch = true
          }
        })
      })
    })
    products.forEach(product => {
      product.variants = product.variants.filter(variant => variant.colourMatch)
    })
    products = products.filter(product => product.variants.length > 0)
    return products
  }

  function filterBySizes(sizes, products) {
    const variants = []
    sizes.forEach(size => {
      products.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.option1.toLowerCase() === size.toLowerCase() || variant.option1.toLowerCase() === "os") {
            variant.sizeMatch = true
          }
        })
      })
    })
    products.forEach(product => {
      product.variants = product.variants.filter(variant => variant.sizeMatch)
    })
    products = products.filter(product => product.variants.length > 0)
    return products
  }

  function filterByCategory(categories, products) {
    categories.forEach(category => {
      products.forEach(product => {
          if(product.product_type.toLowerCase() === category.toLowerCase()) {
            product.matchCategory = true
          }
      })
    })
    products = products.filter(product => product.matchCategory)
    return products
  }

  function filterByPrice(priceRange, products) {
    const minPrice = parseFloat(priceRange[0])
    const maxPrice = parseFloat(priceRange[1])

    products.forEach(product => {
      product.variants = product.variants.filter(variant => (parseFloat(variant.price)>=minPrice && parseFloat(variant.price) <= maxPrice))
    })
    return products.filter(product => product.variants.length > 0)
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
    if(options.prices) {
      stock = filterByPrice(options.prices, stock);
      console.info(stock);
    }
    if(options.colours) {
      stock = filterByColours(options.colours, stock)
      console.info(stock);
    }
    if(options.sizes) {
      stock = filterBySizes(options.sizes, stock)
      console.info(stock)
    }
    if(options.categories) {
      stock = filterByCategory(options.categories, stock)
      console.info(stock)
    }
    return stock
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
        colours:["black" ,"RED"],
        categories:["JEWELLERY"]
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
