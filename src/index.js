$(document).ready(function() {
  const productCol = []
  const table = $('#jsonData')

  function getVariants(variants) {
    if (variants.length > 0) {
      console.info(variants)
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
        <td>${getVariants(product.variants)}</td>
        <td>
          ${product.variants.weight}
          ${product.variants.weight_unit}
        </td>
        <td>
          <img src="${product.image.src}"/>
        </td>
      </tr>`);
    });
  })
  .then(() => {

  })
})
