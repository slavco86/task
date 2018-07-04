// $(document).ready(function() {
  const products = []
  const productContainer = $('.products')
  const uiContainer = $('.ui')
  const prices = []
  const colours = []
  const sizes = []
  const categories = []
  const filterOptions = {
    sizes: [],
    prices: [],
    colours: [],
    categories: []
  }

  function getCollection(value, array) {
    if ($.inArray(value, array) === -1) {
      array.push(value)
    }
  }

  function filterByColours(colours, filterProducts) {
    colours.forEach(colour => {
      filterProducts.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.option2.toLowerCase() === colour.toLowerCase()) {
            variant.colourMatch = true
          }
        })
      })
    })
    filterProducts.forEach(product => {
      product.variants = product.variants.filter(variant => variant.colourMatch)
    })
    filterProducts = filterProducts.filter(product => product.variants.length > 0)
    return filterProducts
  }

  function filterBySizes(sizes, filterProducts) {
    sizes.forEach(size => {
      filterProducts.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.option1.toLowerCase() === size.toLowerCase() || variant.option1.toLowerCase() === "os") {
            variant.sizeMatch = true
          }
        })
      })
    })
    filterProducts.forEach(product => {
      product.variants = product.variants.filter(variant => variant.sizeMatch)
    })
    filterProducts = filterProducts.filter(product => product.variants.length > 0)
    return filterProducts
  }

  function filterByCategory(categories, filterProducts) {
    categories.forEach(category => {
      filterProducts.forEach(product => {
          if(product.product_type.toLowerCase() === category.toLowerCase()) {
            product.matchCategory = true
          }
      })
    })
    filterProducts = filterProducts.filter(product => product.matchCategory)
    return filterProducts
  }

  function filterByPrice(priceRange, filterProducts) {
    const minPrice = parseFloat(priceRange[0])
    const maxPrice = parseFloat(priceRange[1])

    filterProducts.forEach(product => {
      product.variants = product.variants.filter(variant => (parseFloat(variant.price)>=minPrice && parseFloat(variant.price) <= maxPrice))
    })
    return filterProducts.filter(product => product.variants.length > 0)
  }

  function filterProducts(options, products) {
    let stock = $.extend(true, [], products);
    if(options.prices.length > 0) {
      stock = filterByPrice(options.prices, stock);
    }
    if(options.colours.length > 0) {
      stock = filterByColours(options.colours, stock);
    }
    if(options.sizes.length > 0) {
      stock = filterBySizes(options.sizes, stock);
    }
    if(options.categories.length > 0) {
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
          <span class="product-title">${product.title.toLowerCase()}</span>
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
            ${product.options[1].values.map(colour => `<div class="colour" style="background:${colour.toLowerCase()}; border-color:${colour.toLowerCase()}"></div>`).join("")}
          </div>
        </div>
      `);
    });
  }

  function renderUi(sizes, colours, categories, container) {
    container.append(`
    <div class="option-select size-select option-select--checkboxes">
    <span class="select-title">sizes</span>
      ${sizes.map(size => `
        <label for="size-${size}">${size}</label>
        <input id="size-${size}" type="checkbox" value="${size}">
      `).join("")}
    </div>
    <div class="option-select colours-select option-select--checkboxes">
      <span class="select-title">colours</span>
      ${colours.map(colour => `
        <label for="${colour}">${colour}</label>
        <input id="${colour}" value="${colour}" type="checkbox">
      `).join("")}
    </div>
    <div class="option-select categories-select option-select--checkboxes">
      <span class="select-title">categories</span>
      ${categories.map(category => `
        <label for="${category}">${category}</label>
        <input id="${category}" value="${category}" type="checkbox">
      `).join("")}
    </div>
    `)
    $('.size-select input').change((data) => {
      (data.currentTarget.checked) ? filterOptions.sizes.push($(data.target).val()) : filterOptions.sizes.splice(filterOptions.sizes.indexOf(data.currentTarget.value), 1)
    })
    $('.colours-select input').change((data) => {
      (data.currentTarget.checked) ? filterOptions.colours.push($(data.target).val()) : filterOptions.colours.splice(filterOptions.colours.indexOf(data.currentTarget.value), 1)
    })
    $('.categories-select input').change((data) => {
      (data.currentTarget.checked) ? filterOptions.categories.push($(data.target).val()) : filterOptions.categories.splice(filterOptions.categories.indexOf(data.currentTarget.value), 1)
    })

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
            getCollection(value.toLowerCase(), colours)
          })
        }
      })
    });
  })
  .then(() => {
    $('.price-range').slider({
      step: 0.01,
      range: true,
      min: Math.min(...prices),
      max: Math.max(...prices),
      values: prices,
      slide(event, ui) {
        $('#price-range').val(parseFloat(ui.values[0]) + '-' + parseFloat(ui.values[1])).change()
      }
    });
    $('.price-range').slider('values', 1, Math.max(...prices))
    $('#price-range').val($('.price-range').slider('values', 0) + '-' + $('.price-range').slider('values', 1));
    $('#price-range').change(() => {
      filterOptions.prices = $('#price-range').val().split(/-/)
    })
    renderUi(sizes, colours, categories, uiContainer);
    renderProducts(filterProducts(filterOptions, products), productContainer);
    $('input').change(() => {
      productContainer.empty();
      renderProducts(filterProducts(filterOptions, products), productContainer);
    })
  })
// })
