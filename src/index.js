$(document).ready(function() {
  const products = []
  const productContainer = $('.products')
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

  function filterProducts(options, products) {
    let stock = products;
    if(options.prices) {
      stock = filterByPrice(options.prices, stock);
    }
    if(options.colours) {
      stock = filterByColours(options.colours, stock);
    }
    if(options.sizes) {
      stock = filterBySizes(options.sizes, stock);
    }
    if(options.categories) {
      stock = filterByCategory(options.categories, stock);
    }
    return stock
  }

  function renderProducts(products, container) {
    products.forEach(product => {
      container.append(`
      <div class="product">
            <div class="image">
              <img src="${product.image.src}" alt="">
            </div>
          <span class="title">${product.title}</span>
          <div class="prices">
            <span class="now-price">${product.variants[0].price}</span>
            ${(product.variants[0].compare_at_price === null) ? '' :
            `<span class="savings">
              (
                ${Math.round(product.variants[0].price / Math.round(product.variants[0].compare_at_price)
                * 100)}%)
            </span>`}
            ${(product.variants[0].compare_at_price === null) ? '' :
            `<del class="was-price">
              ${product.variants[0].compare_at_price}
            </del>
            `}
          </div>
          <div class="sizes">
            ${product.options[0].values.map(size => `<span class="size">${size}</span>`).join("")}
          </div>
          <div class="colours">
            ${product.options[1].values.map(colour => `<div class="colour" style="background:${colour}; border-color:${colour}"></div>`).join("")}
          </div>
        </div>
      `);
    });
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
    renderProducts(filterProducts({

      },products), productContainer)
  })
})
