// producto.js
// Lee el id de la URL, busca el producto en el CSV y muestra la info

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10) - 1; // CSV es base 1
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
        return obj;
    });
}

function renderProducto(producto, productos) {
    const tallas = [22,23,24,25,26,27,28,29];
    const colores = productos.filter(p => p.silueta === producto.silueta && p.modelo === producto.modelo)
        .map(p => ({ color: p.color, url_imagen: p.url_imagen, pares: tallas.map(t => p[`n_pares_talla_${t}`]||'0') }));
    // Galería (url_imagen + urls_galeria si existiera)
    let galeria = [producto.url_imagen];
    if(producto.urls_galeria) {
        galeria = galeria.concat(producto.urls_galeria.split('--').map(x=>x.trim()).filter(Boolean));
    }
    document.title = producto.silueta + ' | Brodat Lucky Shoes';
    const main = document.querySelector('main');
    main.innerHTML = `
    <div class="producto-pagina">
      <div class="columna-izq">
        <div class="galeria-principal">
          <img id="img-principal" src="${producto.url_imagen}" alt="${producto.silueta} ${producto.modelo}">
        </div>
        <div class="mini-galeria">
          ${galeria.map((img,i)=>`<img src="${img}" class="mini-img" data-idx="${i}">`).join('')}
        </div>
      </div>
      <div class="columna-der">
        <h1>${producto.silueta} ${producto.modelo}</h1>
        <div class="precio">$${producto.precio}</div>
        <div class="selector-colores">
          <span>Colores:</span>
          <div class="colores-producto">
            ${colores.map((c,i)=>`<button class="color-circulo${i===0?' selected':''}" data-color="${c.color}" data-idx="${i}" title="${c.color}"></button>`).join('')}
          </div>
        </div>
        <div class="selector-tallas">
          <span>Tallas:</span>
          <div class="tallas-producto">
            ${tallas.map((t,i)=>`<button class="talla-btn" data-talla="${t}" data-idx="${i}">${t} mx</button>`).join('')}
          </div>
        </div>
        <div class="disponibilidad" id="disponibilidad"></div>
        <div class="descripcion">${producto.descripcion_larga || ''}</div>
        <button class="comprar-btn">Comprar</button>
      </div>
    </div>
    `;
    let colorIdx = 0;
    let tallaIdx = 0;
    const imgPrincipal = document.getElementById('img-principal');
    const miniImgs = document.querySelectorAll('.mini-img');
    const colorBtns = document.querySelectorAll('.color-circulo');
    const tallaBtns = document.querySelectorAll('.talla-btn');
    function updateTallas() {
        tallaBtns.forEach((btn,i)=>{
            const pares = parseInt(colores[colorIdx].pares[i]||'0',10);
            btn.classList.toggle('agotada', pares===0);
            btn.disabled = pares===0;
        });
        updateDisponibilidad();
    }
    function updateDisponibilidad() {
        const pares = parseInt(colores[colorIdx].pares[tallaIdx]||'0',10);
        document.getElementById('disponibilidad').textContent = pares > 0 ? `Disponibles: ${pares}` : 'Agotado';
    }
    function renderMiniGaleria(galeria) {
        const miniGaleriaDiv = document.querySelector('.mini-galeria');
        miniGaleriaDiv.innerHTML = galeria.map((img,i)=>`<img src="${img}" class="mini-img" data-idx="${i}">`).join('');
        const miniImgs = miniGaleriaDiv.querySelectorAll('.mini-img');
        miniImgs.forEach((img,i)=>{
            img.addEventListener('click',()=>{
                imgPrincipal.src = img.src;
            });
        });
    }
    function updateComprarBtn() {
        const btn = document.querySelector('.comprar-btn');
        const color = colores[colorIdx].color;
        const talla = tallaBtns[tallaIdx].textContent.replace(' mx','');
        const pares = parseInt(colores[colorIdx].pares[tallaIdx]||'0',10);
        if (pares > 0) {
            btn.disabled = false;
            btn.textContent = 'Comprar';
            const mensaje = `Hola Brodat!, me gustaría comprar el modelo ${producto.silueta} ${producto.modelo} color ${color} en talla ${talla}`;
            const url = `https://wa.me/3511152996?text=${encodeURIComponent(mensaje)}`;
            btn.onclick = () => { window.open(url, '_blank'); };
        } else {
            btn.disabled = true;
            btn.textContent = 'No disponible';
            btn.onclick = null;
        }
    }
    colorBtns.forEach((btn,i)=>{
        btn.addEventListener('click',()=>{
            colorBtns.forEach(b=>b.classList.remove('selected'));
            btn.classList.add('selected');
            colorIdx = i;
            imgPrincipal.src = colores[i].url_imagen;
            // Actualizar galería pequeña al cambiar color
            let galeria = [colores[i].url_imagen];
            const prod = productos.find(p => p.silueta === producto.silueta && p.modelo === producto.modelo && p.color === colores[i].color);
            if(prod && prod.urls_galeria) {
                galeria = galeria.concat(prod.urls_galeria.split('--').map(x=>x.trim()).filter(Boolean));
            }
            renderMiniGaleria(galeria);
            updateTallas();
            updateComprarBtn();
        });
        btn.style.background = btn.dataset.color;
    });
    tallaBtns.forEach((btn,i)=>{
        btn.addEventListener('click',()=>{
            tallaBtns.forEach(b=>b.classList.remove('selected'));
            btn.classList.add('selected');
            tallaIdx = i;
            updateDisponibilidad();
            updateComprarBtn();
        });
    });
    // Inicializar galería pequeña al cargar
    renderMiniGaleria(galeria);
    updateTallas();
    updateComprarBtn();
    // Selecciona la primera talla por defecto
    if (tallaBtns.length) {
        tallaBtns[0].classList.add('selected');
    }
}

fetch('/INVENTARIO.csv')
  .then(res => res.text())
  .then(csv => {
    const productos = parseCSV(csv);
    const id = getIdFromUrl();
    if(productos[id]) renderProducto(productos[id], productos);
  });
