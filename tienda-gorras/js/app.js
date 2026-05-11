// ============================================================
// STATE
// ============================================================
let carrito        = [];
let filtroCategoria = 'all';
let filtroBusqueda  = '';

// ============================================================
// CART — DATA
// ============================================================
function agregarAlCarrito(id) {
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    const p = productos.find(p => p.id === id);
    if (!p) return;
    carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, cantidad: 1 });
  }
  guardarCarrito();
  actualizarUI();
  toast('✓ ' + productos.find(p => p.id === id).nombre + ' agregado');
  abrirCarrito();
}

function cambiarCantidad(id, delta) {
  const idx = carrito.findIndex(i => i.id === id);
  if (idx === -1) return;
  carrito[idx].cantidad += delta;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  guardarCarrito();
  actualizarUI();
}

function calcularTotal() {
  return carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

function cantidadTotal() {
  return carrito.reduce((s, i) => s + i.cantidad, 0);
}

// ============================================================
// CART — RENDER
// ============================================================
function actualizarUI() {
  renderProductos();
  renderCarrito();
  actualizarContador();
}

function renderProductos() {
  const grid = document.getElementById('productos-grid');
  const info = document.getElementById('results-info');

  let lista = productos;
  if (filtroCategoria !== 'all') lista = lista.filter(p => p.categoria === filtroCategoria);
  if (filtroBusqueda)            lista = lista.filter(p => p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()));

  info.textContent = lista.length + ' producto' + (lista.length !== 1 ? 's' : '');

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="ei">🧢</div>
        <h3>SIN RESULTADOS</h3>
        <p>Probá con otra búsqueda o categoría</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(p => {
    const cant = (carrito.find(i => i.id === p.id) || {}).cantidad || 0;
    return `
      <div class="producto-card">
        <div class="producto-img-wrap">
          <img src="${p.imagen}" alt="${p.nombre}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder">🧢</div>
          ${cant > 0 ? `<div class="qty-badge">${cant}</div>` : ''}
        </div>
        <div class="producto-info">
          <span class="producto-cat">${p.categoria}</span>
          <h3 class="producto-nombre">${p.nombre}</h3>
          <p class="producto-precio">$${p.precio.toFixed(2)}</p>
          <div class="producto-controles">
            ${cant > 0
              ? `<div class="qty-control">
                   <button onclick="cambiarCantidad(${p.id},-1)" aria-label="Quitar">−</button>
                   <span>${cant}</span>
                   <button onclick="cambiarCantidad(${p.id},1)" aria-label="Agregar">+</button>
                 </div>`
              : `<button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">
                   + Agregar $${p.precio.toFixed(2)}
                 </button>`
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderCarrito() {
  const itemsEl   = document.getElementById('cart-items');
  const totalEl   = document.getElementById('cart-total');
  const chkTotEl  = document.getElementById('checkout-total');
  const btnChk    = document.getElementById('btn-checkout');
  const total     = calcularTotal();

  totalEl.textContent  = '$' + total.toFixed(2);
  if (chkTotEl) chkTotEl.textContent = '$' + total.toFixed(2);
  btnChk.disabled = carrito.length === 0;

  if (carrito.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty-msg">
        <div class="ei">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>`;
    return;
  }

  itemsEl.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <div style="position:relative;flex-shrink:0">
        <img src="${item.imagen}" alt="${item.nombre}" class="ci-img"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="ci-img-ph">🧢</div>
      </div>
      <div class="ci-info">
        <div class="ci-name">${item.nombre}</div>
        <div class="ci-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
        <div class="ci-controls">
          <button class="ci-qty-btn ${item.cantidad === 1 ? 'del' : ''}"
                  onclick="cambiarCantidad(${item.id},-1)"
                  aria-label="${item.cantidad === 1 ? 'Eliminar' : 'Quitar uno'}">
            ${item.cantidad === 1 ? '🗑' : '−'}
          </button>
          <span class="ci-qty">${item.cantidad}</span>
          <button class="ci-qty-btn" onclick="cambiarCantidad(${item.id},1)" aria-label="Agregar uno">+</button>
          <span class="ci-unit">$${item.precio.toFixed(2)} c/u</span>
        </div>
      </div>
    </div>`).join('');
}

function actualizarContador() {
  const n = cantidadTotal();
  const el = document.getElementById('cart-count');
  el.textContent = n;
  el.style.display = n > 0 ? 'flex' : 'none';
}

// ============================================================
// CART SIDEBAR — OPEN / CLOSE / VIEWS
// ============================================================
function abrirCarrito() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
  irAVista('carrito');
}

function irAVista(vista) {
  const cv = document.getElementById('cart-view');
  const co = document.getElementById('checkout-view');
  if (vista === 'checkout') {
    cv.classList.add('slide-left');
    co.classList.add('slide-in');
  } else {
    cv.classList.remove('slide-left');
    co.classList.remove('slide-in');
  }
}

// ============================================================
// CHECKOUT FORM
// ============================================================
function actualizarCamposEntrega() {
  const tipo = document.getElementById('f-entrega').value;
  document.getElementById('info-local').classList.toggle('hidden',   tipo !== 'local');
  document.getElementById('info-delivery').classList.toggle('hidden', tipo !== 'delivery');
  document.getElementById('info-empresa').classList.toggle('hidden',  tipo !== 'empresa');
}

function getPagoSeleccionado() {
  const checked = document.querySelector('input[name="pago"]:checked');
  return checked ? checked.value : 'yappy';
}

function validarFormulario() {
  const nombre  = document.getElementById('f-nombre').value.trim();
  const wa      = document.getElementById('f-whatsapp').value.trim();
  const entrega = document.getElementById('f-entrega').value;

  if (!nombre)  { toast('⚠️ Ingresá tu nombre completo', 'error');       return false; }
  if (!wa)      { toast('⚠️ Ingresá tu número de WhatsApp', 'error');    return false; }
  if (!entrega) { toast('⚠️ Seleccioná el tipo de entrega', 'error');    return false; }

  if (entrega === 'delivery') {
    if (!document.getElementById('f-direccion').value.trim()) {
      toast('⚠️ Ingresá la dirección de entrega', 'error'); return false;
    }
  }
  if (entrega === 'empresa') {
    if (!document.getElementById('f-provincia').value) {
      toast('⚠️ Seleccioná tu provincia', 'error'); return false;
    }
    if (!document.getElementById('f-dir-empresa').value.trim()) {
      toast('⚠️ Ingresá la dirección completa', 'error'); return false;
    }
  }
  return true;
}

function confirmarPedido() {
  if (carrito.length === 0) { toast('⚠️ El carrito está vacío', 'error'); return; }
  if (!validarFormulario()) return;

  const entrega  = document.getElementById('f-entrega').value;
  const nombre   = document.getElementById('f-nombre').value.trim();
  const wa       = document.getElementById('f-whatsapp').value.trim();
  const nota     = document.getElementById('f-nota').value.trim();
  const pago     = entrega === 'empresa' ? 'yappy' : getPagoSeleccionado();
  const dir      = entrega === 'delivery'
                     ? document.getElementById('f-direccion').value.trim()
                     : entrega === 'empresa'
                       ? document.getElementById('f-dir-empresa').value.trim()
                       : '';
  const prov     = entrega === 'empresa' ? document.getElementById('f-provincia').value : '';

  const pedido = {
    id:         'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2,6).toUpperCase(),
    timestamp:  Date.now(),
    fecha:      new Date().toLocaleString('es-PA'),
    estado:     'nuevo',
    cliente:    nombre,
    whatsapp:   wa,
    items:      carrito.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
    total:      calcularTotal(),
    tipoEntrega: entrega,
    metodoPago:  pago,
    direccion:   dir,
    provincia:   prov,
    nota:        nota
  };

  // Guardar en localStorage
  try {
    const pedidos = JSON.parse(localStorage.getItem('caps_pedidos') || '[]');
    pedidos.unshift(pedido);
    localStorage.setItem('caps_pedidos', JSON.stringify(pedidos));
  } catch (e) { /* continúa igual */ }

  // Abrir WhatsApp
  const msg = generarMensajeWA(pedido);
  window.open('https://wa.me/' + WHATSAPP_NEGOCIO + '?text=' + encodeURIComponent(msg), '_blank');

  // Limpiar
  carrito = [];
  guardarCarrito();
  cerrarCarrito();
  actualizarUI();
  document.getElementById('checkout-form').reset();
  actualizarCamposEntrega();
  toast('✓ ¡Pedido confirmado! Abriendo WhatsApp...', 'success');
}

function generarMensajeWA(p) {
  const entregaLabel = { local: 'Retiro en local', delivery: 'Delivery propio', empresa: 'Envío por empresa' }[p.tipoEntrega];
  const pagoLabel    = p.metodoPago === 'efectivo' ? 'Efectivo' : 'Yappy (' + YAPPY_NUMERO + ')';

  let lineas = [
    '🧢 *Nuevo Pedido — ' + NOMBRE_NEGOCIO + '*',
    '',
    '👤 *Cliente:* ' + p.cliente,
    '📱 *WhatsApp:* ' + p.whatsapp,
    '',
    '📦 *Productos:*',
  ];

  p.items.forEach(i => {
    lineas.push('  • ' + i.cantidad + 'x ' + i.nombre + ' — $' + (i.precio * i.cantidad).toFixed(2));
  });

  lineas.push('');
  lineas.push('💰 *Total:* $' + p.total.toFixed(2));
  lineas.push('');
  lineas.push('🚚 *Entrega:* ' + entregaLabel);

  if (p.tipoEntrega === 'local') {
    lineas.push('📍 *Dirección local:* ' + DIRECCION_LOCAL);
  }
  if (p.direccion) {
    lineas.push('📍 *Dirección:* ' + p.direccion);
  }
  if (p.provincia) {
    lineas.push('🗺️ *Provincia:* ' + p.provincia);
  }

  lineas.push('💳 *Pago:* ' + pagoLabel);

  if (p.nota) {
    lineas.push('');
    lineas.push('📝 *Nota:* ' + p.nota);
  }

  lineas.push('');
  lineas.push('⏰ ' + p.fecha);
  lineas.push('🆔 ' + p.id);

  return lineas.join('\n');
}

// ============================================================
// STORAGE
// ============================================================
function guardarCarrito() {
  try { localStorage.setItem('caps_carrito', JSON.stringify(carrito)); } catch (e) {}
}

function cargarCarrito() {
  try {
    const s = localStorage.getItem('caps_carrito');
    if (s) carrito = JSON.parse(s);
  } catch (e) { carrito = []; }
}

// ============================================================
// TOAST
// ============================================================
function toast(msg, tipo) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast' + (tipo ? ' ' + tipo : '');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Inyectar datos del negocio
  document.querySelectorAll('.negocio-nombre').forEach(el => el.textContent = NOMBRE_NEGOCIO);
  document.querySelectorAll('#yappy-num').forEach(el => el.textContent = YAPPY_NUMERO);
  document.querySelectorAll('#dir-local').forEach(el => el.textContent = DIRECCION_LOCAL);
  document.title = NOMBRE_NEGOCIO;

  cargarCarrito();
  actualizarUI();

  // Cart open/close
  document.getElementById('cart-toggle').addEventListener('click', abrirCarrito);
  document.getElementById('cart-overlay').addEventListener('click', cerrarCarrito);
  document.querySelectorAll('.cart-close-btn').forEach(btn => btn.addEventListener('click', cerrarCarrito));

  // Checkout navigation
  document.getElementById('btn-checkout').addEventListener('click', function () {
    if (carrito.length > 0) irAVista('checkout');
  });
  document.getElementById('cart-back').addEventListener('click', function () {
    irAVista('carrito');
  });

  // Search
  document.getElementById('search').addEventListener('input', function () {
    filtroBusqueda = this.value;
    renderProductos();
  });

  // Category buttons
  document.querySelectorAll('.cat-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filtroCategoria = this.dataset.cat;
      renderProductos();
    });
  });

  // Delivery type change
  document.getElementById('f-entrega').addEventListener('change', actualizarCamposEntrega);

  // Payment option styles
  document.addEventListener('change', function (e) {
    if (e.target.name === 'pago') {
      e.target.closest('.pago-options').querySelectorAll('.pago-opt').forEach(function (opt) {
        opt.classList.toggle('selected', opt.querySelector('input').checked);
      });
    }
  });

  // Confirm order
  document.getElementById('btn-confirmar').addEventListener('click', confirmarPedido);

  // Allow submit on Enter in form
  document.getElementById('checkout-form').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      confirmarPedido();
    }
  });
});
