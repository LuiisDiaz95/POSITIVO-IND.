import { supabase } from './supabase.js';
/* ====== CONFIGURACIÓN (editá estos datos) ====== */
const CONFIG = {
  whatsapp: '5493810000000', // código país + área + número, sin + ni espacios
  direccion: 'Calle Laprida esq. 9 de Julio',
  ciudad: 'La Trinidad, Tucumán',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+Laprida+y+9+de+Julio+La+Trinidad+Tucuman'
};
let PRODUCTOS = [];
const MAPEO_CATEGORIAS = {
  remeras: ['remera', 'remeras','camisas'],
  buzos: ['buzo', 'buzos'],
  camperas: ['campera', 'camperas', 'camisaco'],
  pantalones: ['jean', 'jeans', 'bermuda', 'bermudas', 'pantalon', 'pantalones'],
};
const $ = s => document.querySelector(s);

const peso = n =>
  '$' + Number(n).toLocaleString('es-AR');

const wsp = texto =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

// Normalizar textos para comparar categorías
const normalizar = texto =>
  texto?.toLowerCase().trim() || '';


/* ================================================
   INFORMACIÓN LOCAL DEL NEGOCIO
================================================ */

function iniciarLocal() {
  $('#direccion').textContent = CONFIG.direccion;
  $('#ciudad').textContent = CONFIG.ciudad;
  $('#mapa').href = CONFIG.mapa;
  $('#wsp').href = wsp('Hola! Quiero consultar por la colección.');
}


/* ================================================
   CARGAR PRODUCTOS DESDE SUPABASE
================================================ */

async function cargarProductos() {

  $('#productos').innerHTML =
    '<p class="muted">Cargando productos...</p>';

  const { data, error } = await supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      descripcion,
      precio,
      imagen,
      categoria (
        nombre
      ),
      talles_producto (
        talle,
        stock
      )
    `)
    .eq('activo', true)
    .order('id_producto');

  if (error) {
    console.error('Error al cargar productos:', error);

    $('#productos').innerHTML =
      '<p class="muted">Error al cargar los productos. Intentá nuevamente.</p>';

    return;
  }

  PRODUCTOS = data || [];

  mostrarProductos();
}


/* ================================================
   MOSTRAR PRODUCTOS EN HTML
================================================ */

function mostrarProductos(cat = 'todos') {
  const catBoton = cat.toLowerCase().trim();
  const lista = cat === 'todos'
    ? PRODUCTOS
    : PRODUCTOS.filter(p => {
      const nombreCatDb = p.categoria?.nombre?.toLowerCase() || '';
        
        const palabrasClave = MAPEO_CATEGORIAS[catBoton] || [catBoton];

        return palabrasClave.some(palabra => nombreCatDb.includes(palabra));
      });

  $('#productos').innerHTML = lista.map(p => {

    // Ruta local de la imagen
    const imagen = p.imagen
      ? `img/${p.imagen}`
      : null;

    // Mostrar únicamente talles con stock
    const tallesDisponibles = (p.talles_producto || [])
      .filter(t => t.stock > 0)
      .map(t => t.talle);

    return `
      <article class="card">

        <div class="ph">
          ${imagen
        ? `<img
                src="${imagen}"
                alt="${p.nombre}"
                loading="lazy"
                onerror="this.style.display='none'; this.parentElement.textContent='${p.nombre[0]}'"
              >`
        : p.nombre[0]
      }
        </div>

        <div class="info">

          <h3>${p.nombre}</h3>

          <p>${p.descripcion || ''}</p>

          <p class="precio">
            ${peso(p.precio)}
          </p>

          <p class="talles">
            Talles:
            ${tallesDisponibles.length
        ? tallesDisponibles.join(' · ')
        : 'Sin stock'
      }
          </p>

          <a
            target="_blank"
            rel="noopener"
            href="${wsp('Hola! Me interesa: ' + p.nombre)}"
          >
            Consultar →
          </a>

        </div>

      </article>
    `;
  }).join('') || '<p class="muted">Sin productos.</p>';
}


/* ================================================
   FILTROS DE CATEGORÍAS
================================================ */

$('#filtros').addEventListener('click', e => {

  const b = e.target.closest('button');

  if (!b) return;

  document.querySelectorAll('#filtros button')
    .forEach(x => x.classList.remove('active'));

  b.classList.add('active');
  mostrarProductos(b.dataset.cat);
});


/* ================================================
   FORMULARIO DE CONTACTO - WHATSAPP
================================================ */

$('#form').addEventListener('submit', e => {

  e.preventDefault();

  const d = Object.fromEntries(new FormData(e.target));

  const texto =
    `Hola! Soy ${d.nombre}` +
    `${d.telefono ? ' (' + d.telefono + ')' : ''}. ` +
    `${d.mensaje}`;

  window.open(wsp(texto), '_blank');

  $('#estado').textContent =
    '¡Gracias! Se abrió WhatsApp para enviar tu mensaje.';

  e.target.reset();
});


/* ================================================
   NAVEGACIÓN MOBILE
================================================ */

document.querySelectorAll('.nav nav a').forEach(a =>
  a.addEventListener('click', () =>
    document.body.classList.remove('open')
  )
);


/* ================================================
   INICIALIZACIÓN
================================================ */

iniciarLocal();
cargarProductos();
