$(document).ready(function() {
  const productCol = []
  const table = $('#jsonData')

  function getVariants(variants) {
    console.info(variants)
    if (variants.length > 0) {
    }
  }

  $.getJSON('data.json', function(data) {
    data.products.forEach(product => {
      productCol.push(product)
    });
  })
  .then(() => {
    productCol.forEach(product => {
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
