/* ====== CONFIGURACIÓN (editá estos datos) ====== */
const CONFIG = {
    whatsapp: '5493810000000', // código país + área + número, sin + ni espacios
    direccion: 'Calle Laprida esq. 9 de Julio',
    ciudad: 'La Trinidad, Tucumán',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+Laprida+y+9+de+Julio+La+Trinidad+Tucuman'
  };
  
  const PRODUCTOS = [
    { nombre: 'Campera Borrego',       categoria: 'camperas',   precio: 85000, talles: ['M','L','XL'] },
    { nombre: 'Remera Oversize Negra', categoria: 'remeras',    precio: 22000, talles: ['S','M','L','XL'] },
    { nombre: 'Jean Cargo',            categoria: 'pantalones', precio: 48000, talles: ['38','40','42','44'] },
    { nombre: 'Buzo Canguro',          categoria: 'buzos',      precio: 52000, talles: ['M','L','XL'] },
    { nombre: 'Remera Estampada',      categoria: 'remeras',    precio: 24000, talles: ['S','M','L'] },
    { nombre: 'Bermuda Jogger',        categoria: 'pantalones', precio: 30000, talles: ['M','L','XL'] }
  ];
  /* ================================================ */
  
  const $ = s => document.querySelector(s);
  const peso = n => '$' + n.toLocaleString('es-AR');
  const wsp = texto => https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)};
  
  function iniciarLocal() {
    $('#direccion').textContent = CONFIG.direccion;
    $('#ciudad').textContent = CONFIG.ciudad;
    $('#mapa').href = CONFIG.mapa;
    $('#wsp').href = wsp('Hola! Quiero consultar por la colección.');
  }
  
  function mostrarProductos(cat = 'todos') {
    const lista = cat === 'todos' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === cat);
    $('#productos').innerHTML = lista.map(p => `
      <article class="card">
        <div class="ph">${p.nombre[0]}</div>
        <div class="info">
          <h3>${p.nombre}</h3>
          <p class="precio">${peso(p.precio)}</p>
          <p class="talles">Talles: ${p.talles.join(' · ')}</p>
          <a target="_blank" rel="noopener" href="${wsp('Hola! Me interesa: ' + p.nombre)}">Consultar →</a>
        </div>
      </article>`).join('') || '<p class="muted">Sin productos.</p>';
  }
  
  $('#filtros').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#filtros button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    mostrarProductos(b.dataset.cat);
  });
  
  // El formulario abre WhatsApp con el mensaje armado
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const texto = Hola! Soy ${d.nombre}${d.telefono ? ' (' + d.telefono + ')' : ''}. ${d.mensaje};
    window.open(wsp(texto), '_blank');
    $('#estado').textContent = '¡Gracias! Se abrió WhatsApp para enviar tu mensaje.';
    e.target.reset();
  });
  
  document.querySelectorAll('.nav nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('open')));
  
  iniciarLocal();
  mostrarProductos();