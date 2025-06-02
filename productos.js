// Lee el archivo INVENTARIO.csv y genera las cartas de producto dinámicamente
fetch('INVENTARIO.csv')
  .then(res => res.text())
  .then(csv => {
    const lines = csv.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    const headers = lines[0].split(',');
    const productos = lines.slice(1).map(line => {
      // Maneja comas dentro de campos si fuera necesario (aquí asume simple)
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
      return obj;
    });
    const container = document.getElementById('productos-container');
    const combinaciones = {};
    productos.forEach((producto, idx) => {
      if (!producto.modelo || !producto.precio || !producto.url_imagen) return; // Salta vacíos
      if (producto.visible === '0') return; // No mostrar si visible es 0
      const nombreCompleto = `${producto.silueta || ''} ${producto.modelo || ''}`.trim();
      // Si ya existe la combinación, solo agrega el color
      if (combinaciones[nombreCompleto]) {
        const coloresDiv = combinaciones[nombreCompleto].querySelector('.colores-producto');
        if (coloresDiv && producto.color) {
          const colorCircle = document.createElement('div');
          colorCircle.className = 'color-circulo';
          colorCircle.title = producto.color;
          colorCircle.setAttribute('data-color', producto.color.toLowerCase());
          // Elimina eventos hover, solo click
          colorCircle.addEventListener('click', function() {
            const allCircles = coloresDiv.querySelectorAll('.color-circulo');
            allCircles.forEach(c => c.classList.remove('selected'));
            colorCircle.classList.add('selected');
            const img = combinaciones[nombreCompleto].querySelector('img');
            if (img) img.src = producto.url_imagen;
            combinaciones[nombreCompleto].dataset.defaultImg = producto.url_imagen;
          });
          coloresDiv.appendChild(colorCircle);
        }
        return;
      }
      // Si es la primera vez, crea la tarjeta y el primer círculo de color
      const card = document.createElement('section');
      card.className = 'producto';
      // Círculos de colores
      let coloresHTML = '';
      if (producto.color) {
        coloresHTML = `<div class="color-circulo" title="${producto.color}" data-color="${producto.color.toLowerCase()}"></div>`;
      }
      // Envolver la imagen en un <a> con el id del producto (idx+1 para que empiece en 1)
      card.innerHTML = `
        <a href="producto.html?id=${idx+1}"><img src="${producto.url_imagen}" alt="${nombreCompleto}">
        <h2>${nombreCompleto}</h2></a>
        <div class="colores-producto">${coloresHTML}</div>
        <p>Precio: $${producto.precio} MXN</p>
      `;
      // Guarda la imagen por defecto en un atributo para restaurar
      card.dataset.defaultImg = producto.url_imagen;
      container.appendChild(card);
      combinaciones[nombreCompleto] = card;
      // Añade eventos hover al primer círculo
      const primerCirculo = card.querySelector('.color-circulo');
      if (primerCirculo) {
        // Elimina eventos hover, solo click
        primerCirculo.addEventListener('click', function() {
          const allCircles = card.querySelectorAll('.color-circulo');
          allCircles.forEach(c => c.classList.remove('selected'));
          primerCirculo.classList.add('selected');
          const img = card.querySelector('img');
          if (img) img.src = producto.url_imagen;
          card.dataset.defaultImg = producto.url_imagen;
        });
        // Selecciona el primer color por defecto y muestra su imagen
        primerCirculo.classList.add('selected');
        const img = card.querySelector('img');
        if (img) img.src = producto.url_imagen;
        card.dataset.defaultImg = producto.url_imagen;
      }
    });
  });
