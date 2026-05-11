// ============================================================
// STATE
// ============================================================
let pedidos       = [];
let filtroEstado  = 'all';
let filtroEntrega = 'all';

// ============================================================
// AUTH
// ============================================================
function checkSession() {
  if (sessionStorage.getItem('caps_admin') === '1') {
    mostrarDashboard();
  } else {
    mostrarLogin();
  }
}

function handleLogin() {
  const pass = document.getElementById('login-password').value;
  const err  = document.getElementById('login-error');
  if (pass === PASSWORD_ADMIN) {
    sessionStorage.setItem('caps_admin', '1');
    err.style.display = 'none';
    mostrarDashboard();
  } else {
    err.textContent = '⚠️ Contraseña incorrecta';
    err.style.display = 'block';
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function handleLogout() {
  sessionStorage.removeItem('caps_admin');
  mostrarLogin();
}

function mostrarLogin() {
  document.getElementById('login-screen').style.display    = 'flex';
  document.getElementById('dashboard-screen').style.display = 'none';
}

function mostrarDashboard() {
  document.getElementById('login-screen').style.display    = 'none';
  document.getElementById('dashboard-screen').style.display = 'block';
  cargarPedidos();
}

// ============================================================
// DATA
// ============================================================
function cargarPedidos() {
  try {
    pedidos = JSON.parse(localStorage.getItem('caps_pedidos') || '[]');
  } catch (e) {
    pedidos = [];
  }
  renderPedidos();
  actualizarStats();
}

function pedidosFiltrados() {
  let lista = pedidos;
  if (filtroEstado  !== 'all') lista = lista.filter(p => p.estado      === filtroEstado);
  if (filtroEntrega !== 'all') lista = lista.filter(p => p.tipoEntrega === filtroEntrega);
  return lista;
}

// ============================================================
// RENDER
// ============================================================
function renderPedidos() {
  const container = document.getElementById('pedidos-container');
  const lista     = pedidosFiltrados();
  const countEl   = document.getElementById('filter-count');

  countEl.textContent = lista.length + ' pedido' + (lista.length !== 1 ? 's' : '');

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="admin-empty">
        <div style="font-size:2.5rem">📋</div>
        <h3>${pedidos.length > 0 ? 'SIN RESULTADOS' : 'SIN PEDIDOS'}</h3>
        <p>${pedidos.length > 0 ? 'No hay pedidos con los filtros seleccionados.' : 'Aún no se recibieron pedidos.'}</p>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(renderCard).join('');
}

function renderCard(p) {
  const badgeMap = {
    nuevo:       '<span class="badge badge-nuevo">Nuevo</span>',
    en_proceso:  '<span class="badge badge-proceso">En proceso</span>',
    completado:  '<span class="badge badge-completado">Completado</span>'
  };

  const entregaMap = {
    local:    '🏪 Retiro en local',
    delivery: '🛵 Delivery propio',
    empresa:  '📦 Envío por empresa'
  };

  const badge       = badgeMap[p.estado]         || '';
  const entregaTxt  = entregaMap[p.tipoEntrega]  || p.tipoEntrega;
  const pagoTxt     = p.metodoPago === 'efectivo' ? '💵 Efectivo' : '📲 Yappy';
  const waTel       = p.whatsapp.replace(/\D/g, '');

  const btnSig = p.estado === 'nuevo'
    ? `<button class="btn-estado proceso"    onclick="cambiarEstado('${p.id}','en_proceso')">→ En proceso</button>`
    : p.estado === 'en_proceso'
      ? `<button class="btn-estado completado" onclick="cambiarEstado('${p.id}','completado')">✓ Completado</button>`
      : `<button class="btn-estado reabrir"    onclick="cambiarEstado('${p.id}','en_proceso')">↺ Reabrir</button>`;

  const dirInfo = p.tipoEntrega !== 'local' && p.direccion
    ? `<span>${p.provincia ? '🗺️ ' + p.provincia + ' — ' : ''}📍 ${p.direccion}</span>`
    : '';

  return `
    <div class="pedido-card estado-${p.estado}" id="pcard-${p.id}">

      <div class="pedido-top">
        <div>
          <div class="pedido-id">${p.id}</div>
          <div class="pedido-fecha">⏰ ${p.fecha}</div>
        </div>
        ${badge}
      </div>

      <div class="pedido-cliente">
        <span class="pedido-cliente-nombre">👤 ${p.cliente}</span>
        <a href="https://wa.me/${waTel}" target="_blank" class="pedido-cliente-wa">
          📱 ${p.whatsapp}
        </a>
      </div>

      <div class="pedido-body">
        <div class="pedido-items">
          ${p.items.map(i => `
            <div class="pedido-item">
              <span>${i.cantidad}x ${i.nombre}</span>
              <span>$${(i.precio * i.cantidad).toFixed(2)}</span>
            </div>`).join('')}
        </div>
        <div class="pedido-meta">
          <span>${entregaTxt}</span>
          ${dirInfo}
          <span>${pagoTxt}</span>
          ${p.nota ? `<span class="pedido-nota">📝 "${p.nota}"</span>` : ''}
        </div>
      </div>

      <div class="pedido-foot">
        <div class="pedido-total">$${p.total.toFixed(2)}</div>
        <div class="pedido-acciones">
          ${btnSig}
          <button class="btn-eliminar" onclick="eliminarPedido('${p.id}')" title="Eliminar pedido">🗑</button>
        </div>
      </div>

    </div>`;
}

// ============================================================
// ACTIONS
// ============================================================
function cambiarEstado(id, nuevoEstado) {
  const idx = pedidos.findIndex(p => p.id === id);
  if (idx === -1) return;
  pedidos[idx].estado = nuevoEstado;
  persistirPedidos();
  renderPedidos();
  actualizarStats();
  toast('Estado actualizado ✓', 'success');
}

function eliminarPedido(id) {
  if (!confirm('¿Eliminar este pedido? No se puede deshacer.')) return;
  pedidos = pedidos.filter(p => p.id !== id);
  persistirPedidos();
  renderPedidos();
  actualizarStats();
  toast('Pedido eliminado', 'error');
}

function persistirPedidos() {
  try { localStorage.setItem('caps_pedidos', JSON.stringify(pedidos)); } catch (e) {}
}

// ============================================================
// STATS
// ============================================================
function actualizarStats() {
  document.getElementById('stat-nuevos').textContent      = pedidos.filter(p => p.estado === 'nuevo').length;
  document.getElementById('stat-proceso').textContent     = pedidos.filter(p => p.estado === 'en_proceso').length;
  document.getElementById('stat-completados').textContent = pedidos.filter(p => p.estado === 'completado').length;
  document.getElementById('stat-total').textContent       = pedidos.length;

  const ventas = pedidos
    .filter(p => p.estado === 'completado')
    .reduce((s, p) => s + p.total, 0);
  document.getElementById('stat-ventas').textContent = '$' + ventas.toFixed(2);
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
  checkSession();

  // Login
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('login-password').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleLogin();
  });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', handleLogout);

  // Refresh
  document.getElementById('btn-refresh').addEventListener('click', function () {
    cargarPedidos();
    toast('Pedidos actualizados ✓', 'success');
  });

  // Filters
  document.getElementById('filtro-estado').addEventListener('change', function () {
    filtroEstado = this.value;
    renderPedidos();
  });
  document.getElementById('filtro-entrega').addEventListener('change', function () {
    filtroEntrega = this.value;
    renderPedidos();
  });
});
