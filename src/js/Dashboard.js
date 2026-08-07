'use strict';

/* ============================================================================
   VANTEX CR · script.js
   Contenido cubierto:
   - Constantes y variables
   - Objetos y arreglos
   - Condicionales y ciclos (for, forEach)
   - Métodos de arreglos (map, filter, reduce, find, sort, some)
   - Manipulación del DOM
   - Eventos (click, submit, input, change, delegación)
   - Formularios y validaciones
   - LocalStorage
   ============================================================================ */

/* ---------------------------------------------------------------------------
   1. CONSTANTES DE CONFIGURACIÓN
--------------------------------------------------------------------------- */
const APP_CONFIG = {
  nombreApp: 'Vantex CR',
  moneda: 'CRC',
  salarioMinimo: 350000
};

const STORAGE_KEYS = {
  EMPLEADOS: 'vantex_empleados',
  PROYECTOS: 'vantex_proyectos',
  ACTIVIDAD: 'vantex_actividad',
  PERFIL: 'vantex_perfil',
  TEMA: 'vantex_tema'
};

const DEPARTAMENTOS = ['Tecnología', 'Ventas', 'Recursos Humanos', 'Finanzas', 'Soporte'];

/* ---------------------------------------------------------------------------
   2. DATOS INICIALES (arreglos de objetos)
--------------------------------------------------------------------------- */
const EMPLEADOS_SEMILLA = [
  { id: 'e1', nombre: 'Laura Jiménez Rojas', correo: 'laura.jimenez@vantex.co.cr', puesto: 'Desarrolladora Senior', departamento: 'Tecnología', salario: 1250000, ingreso: '2022-03-14', estado: 'Activo' },
  { id: 'e2', nombre: 'Carlos Mora Vindas', correo: 'carlos.mora@vantex.co.cr', puesto: 'Líder de Proyectos', departamento: 'Tecnología', salario: 1450000, ingreso: '2021-07-01', estado: 'Activo' },
  { id: 'e3', nombre: 'Fabiana Solano Ureña', correo: 'fabiana.solano@vantex.co.cr', puesto: 'Ejecutiva de Ventas', departamento: 'Ventas', salario: 850000, ingreso: '2023-01-20', estado: 'Vacaciones' },
  { id: 'e4', nombre: 'Diego Castro Hidalgo', correo: 'diego.castro@vantex.co.cr', puesto: 'Analista Financiero', departamento: 'Finanzas', salario: 980000, ingreso: '2020-11-05', estado: 'Activo' },
  { id: 'e5', nombre: 'Mariana Zúñiga Pérez', correo: 'mariana.zuniga@vantex.co.cr', puesto: 'Especialista de RRHH', departamento: 'Recursos Humanos', salario: 900000, ingreso: '2023-09-11', estado: 'Activo' },
  { id: 'e6', nombre: 'Esteban Rojas Chaves', correo: 'esteban.rojas@vantex.co.cr', puesto: 'Técnico de Soporte', departamento: 'Soporte', salario: 620000, ingreso: '2024-02-18', estado: 'Inactivo' },
  { id: 'e7', nombre: 'Ana Gómez Vargas', correo: 'ana.gomez@vantex.co.cr', puesto: 'Gerente de TI', departamento: 'Tecnología', salario: 1900000, ingreso: '2019-05-02', estado: 'Activo' }
];

const PROYECTOS_SEMILLA = [
  { id: 'p1', nombre: 'Portal de Autoservicio Clientes', cliente: 'BAC Credomatic', avance: 78, estado: 'En curso', responsable: 'Laura Jiménez' },
  { id: 'p2', nombre: 'Migración a la Nube', cliente: 'Interno', avance: 45, estado: 'En curso', responsable: 'Carlos Mora' },
  { id: 'p3', nombre: 'App de Trazabilidad Logística', cliente: 'Britt Costa Rica', avance: 92, estado: 'Cierre', responsable: 'Diego Castro' },
  { id: 'p4', nombre: 'Rediseño de Facturación', cliente: 'Grupo Nación', avance: 20, estado: 'Inicio', responsable: 'Mariana Zúñiga' },
  { id: 'p5', nombre: 'Integración de Pagos SINPE', cliente: 'Coopeservidores', avance: 60, estado: 'En curso', responsable: 'Esteban Rojas' },
  { id: 'p6', nombre: 'Panel de Analítica Interna', cliente: 'Interno', avance: 33, estado: 'En curso', responsable: 'Ana Gómez' }
];

const ACTIVIDAD_SEMILLA = [
  { icono: 'fa-user-plus', texto: 'Se registró a Mariana Zúñiga en Recursos Humanos', fecha: 'Hace 2 horas' },
  { icono: 'fa-diagram-project', texto: 'Proyecto "Integración de Pagos SINPE" pasó a 60% de avance', fecha: 'Hace 5 horas' },
  { icono: 'fa-file-invoice', texto: 'Se generó el reporte de nómina de julio', fecha: 'Ayer' },
  { icono: 'fa-triangle-exclamation', texto: 'Ticket de soporte #4521 escalado a prioridad alta', fecha: 'Ayer' },
  { icono: 'fa-user-check', texto: 'Esteban Rojas actualizó su estado a Inactivo', fecha: 'Hace 2 días' }
];

/* ---------------------------------------------------------------------------
   3. ESTADO DE LA APLICACIÓN (variables mutables)
--------------------------------------------------------------------------- */
let empleados = [];
let proyectos = [];
let actividad = [];
let perfilUsuario = { nombre: 'Ana Gómez', puesto: 'Gerente de TI', correo: 'ana.gomez@vantex.co.cr' };

let ordenTabla = { campo: 'nombre', direccion: 'asc' };
let filtroTexto = '';
let filtroDepartamento = 'todos';

/* ---------------------------------------------------------------------------
   4. FUNCIONES DE LOCALSTORAGE
--------------------------------------------------------------------------- */
function guardarEnStorage(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('No fue posible guardar en localStorage:', error);
    return false;
  }
}

function leerDeStorage(clave, valorPorDefecto) {
  const crudo = localStorage.getItem(clave);
  if (!crudo) return valorPorDefecto;
  try {
    return JSON.parse(crudo);
  } catch (error) {
    return valorPorDefecto;
  }
}

function inicializarDatos() {
  empleados = leerDeStorage(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_SEMILLA);
  proyectos = leerDeStorage(STORAGE_KEYS.PROYECTOS, PROYECTOS_SEMILLA);
  actividad = leerDeStorage(STORAGE_KEYS.ACTIVIDAD, ACTIVIDAD_SEMILLA);
  perfilUsuario = leerDeStorage(STORAGE_KEYS.PERFIL, perfilUsuario);

  // Si es la primera visita, sembramos los datos base en localStorage
  if (!localStorage.getItem(STORAGE_KEYS.EMPLEADOS)) guardarEnStorage(STORAGE_KEYS.EMPLEADOS, empleados);
  if (!localStorage.getItem(STORAGE_KEYS.PROYECTOS)) guardarEnStorage(STORAGE_KEYS.PROYECTOS, proyectos);
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVIDAD)) guardarEnStorage(STORAGE_KEYS.ACTIVIDAD, actividad);
}

/* ---------------------------------------------------------------------------
   5. UTILIDADES (formato, id, iniciales)
--------------------------------------------------------------------------- */
function formatearColones(numero) {
  return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(numero);
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO + 'T00:00:00');
  return fecha.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function generarId() {
  return 'e' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

function obtenerIniciales(nombreCompleto) {
  const partes = nombreCompleto.trim().split(' ');
  // Ciclo for clásico para tomar primera y segunda inicial
  let iniciales = '';
  for (let i = 0; i < partes.length && iniciales.length < 2; i++) {
    if (partes[i][0]) iniciales += partes[i][0];
  }
  return iniciales.toUpperCase();
}

function registrarActividad(icono, texto) {
  actividad.unshift({ icono: icono, texto: texto, fecha: 'Justo ahora' });
  actividad = actividad.slice(0, 8);
  guardarEnStorage(STORAGE_KEYS.ACTIVIDAD, actividad);
  renderActividad();
}

function mostrarToast(mensaje, tipo) {
  const toast = document.getElementById('toast');
  const icono = tipo === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
  toast.className = 'toast' + (tipo === 'error' ? ' toast--error' : '');
  toast.innerHTML = `<i class="fa-solid ${icono}"></i><span>${mensaje}</span>`;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(mostrarToast._t);
  mostrarToast._t = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

/* ============================================================================
   6. RENDERIZADO — TARJETAS RESUMEN (usa reduce, filter)
   ============================================================================ */
function calcularEstadisticas() {
  const totalEmpleados = empleados.length;

  const activos = empleados.filter(function (emp) { return emp.estado === 'Activo'; }).length;

  const proyectosActivos = proyectos.filter(function (p) { return p.estado !== 'Cierre'; }).length;

  const nominaMensual = empleados.reduce(function (acumulado, emp) {
    return acumulado + emp.salario;
  }, 0);

  const ticketsSoporte = 12; // dato de referencia de mesa de ayuda

  return { totalEmpleados, activos, proyectosActivos, nominaMensual, ticketsSoporte };
}

function renderTarjetas() {
  const stats = calcularEstadisticas();
  const contenedor = document.getElementById('statsCards');

  const tarjetas = [
    {
      icono: 'fa-users', color: 'var(--blue-600)', bg: 'var(--blue-100)', barra: 'var(--blue-500)',
      valor: stats.totalEmpleados, etiqueta: 'Total de empleados', tendencia: '+4.2%', subiendo: true
    },
    {
      icono: 'fa-diagram-project', color: 'var(--navy-900)', bg: 'var(--blue-100)', barra: 'var(--navy-800)',
      valor: stats.proyectosActivos, etiqueta: 'Proyectos activos', tendencia: '+2', subiendo: true
    },
    {
      icono: 'fa-sack-dollar', color: 'var(--blue-700)', bg: 'var(--blue-100)', barra: 'var(--blue-700)',
      valor: formatearColones(stats.nominaMensual), etiqueta: 'Nómina mensual', tendencia: '+1.8%', subiendo: true
    },
    {
      icono: 'fa-headset', color: 'var(--danger)', bg: 'var(--danger-bg)', barra: 'var(--danger)',
      valor: stats.ticketsSoporte, etiqueta: 'Tickets de soporte', tendencia: '-6%', subiendo: false
    }
  ];

  contenedor.innerHTML = tarjetas.map(function (t) {
    return `
      <div class="card" style="--bar-color:${t.barra}; --icon-bg:${t.bg}; --icon-color:${t.color}">
        <div class="card__top">
          <div class="card__icon"><i class="fa-solid ${t.icono}"></i></div>
          <span class="card__trend ${t.subiendo ? 'up' : 'down'}">
            <i class="fa-solid ${t.subiendo ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>${t.tendencia}
          </span>
        </div>
        <div class="card__value">${t.valor}</div>
        <div class="card__label">${t.etiqueta}</div>
      </div>`;
  }).join('');
}

/* ---- Distribución por departamento (map + reduce) ---- */
function renderDistribucionDepartamentos() {
  const contenedor = document.getElementById('deptChart');
  const total = empleados.length || 1;

  const conteo = DEPARTAMENTOS.map(function (dep) {
    const cantidad = empleados.filter(function (e) { return e.departamento === dep; }).length;
    return { departamento: dep, cantidad: cantidad, porcentaje: Math.round((cantidad / total) * 100) };
  });

  contenedor.innerHTML = conteo.map(function (c) {
    return `
      <div class="barlist__row">
        <span>${c.departamento}</span>
        <div class="barlist__track"><div class="barlist__fill" style="width:${c.porcentaje}%"></div></div>
        <span class="barlist__count">${c.cantidad}</span>
      </div>`;
  }).join('');
}

/* ---- Actividad reciente ---- */
function renderActividad() {
  const lista = document.getElementById('activityList');
  lista.innerHTML = actividad.map(function (item) {
    return `
      <li>
        <div class="activity__icon"><i class="fa-solid ${item.icono}"></i></div>
        <div class="activity__body">
          <p>${item.texto}</p>
          <span>${item.fecha}</span>
        </div>
      </li>`;
  }).join('');
}

/* ---- Proyectos mini (dashboard) y grid completo ---- */
function renderProyectosMini() {
  const contenedor = document.getElementById('projectsMini');
  const destacados = proyectos.slice(0, 3);
  contenedor.innerHTML = destacados.map(construirTarjetaProyectoMini).join('');
}

function construirTarjetaProyectoMini(p) {
  return `
    <div class="pmini">
      <div class="pmini__top"><strong>${p.nombre}</strong><span class="pmini__pct">${p.avance}%</span></div>
      <div class="pmini__track"><div class="pmini__fill" style="width:${p.avance}%"></div></div>
      <div class="pmini__meta">${p.cliente} · ${p.responsable}</div>
    </div>`;
}

function renderProyectosGrid() {
  const contenedor = document.getElementById('projectsGrid');
  const resumen = document.getElementById('projectsSummary');
  resumen.textContent = `${proyectos.length} proyectos · ${proyectos.filter(p => p.estado !== 'Cierre').length} en curso`;

  contenedor.innerHTML = proyectos.map(function (p) {
    return `
      <div class="pcard">
        <div class="pcard__head">
          <h3>${p.nombre}</h3>
          <span class="badge badge--active">${p.estado}</span>
        </div>
        <p class="pdesc">Cliente: ${p.cliente} · Responsable: ${p.responsable}</p>
        <div class="pcard__track"><div class="pcard__fill" style="width:${p.avance}%"></div></div>
        <div class="pcard__foot"><span>Avance</span><span>${p.avance}%</span></div>
      </div>`;
  }).join('');
}

/* ============================================================================
   7. TABLA DE EMPLEADOS (filter, sort, find)
   ============================================================================ */
function obtenerEmpleadosFiltrados() {
  let resultado = empleados.filter(function (emp) {
    const coincideTexto =
      emp.nombre.toLowerCase().includes(filtroTexto) ||
      emp.correo.toLowerCase().includes(filtroTexto);
    const coincideDepto = filtroDepartamento === 'todos' || emp.departamento === filtroDepartamento;
    return coincideTexto && coincideDepto;
  });

  const campo = ordenTabla.campo;
  resultado.sort(function (a, b) {
    let valorA = a[campo];
    let valorB = b[campo];
    if (typeof valorA === 'string') { valorA = valorA.toLowerCase(); valorB = valorB.toLowerCase(); }
    if (valorA < valorB) return ordenTabla.direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenTabla.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  return resultado;
}

function claseBadgeEstado(estado) {
  if (estado === 'Activo') return 'badge--active';
  if (estado === 'Vacaciones') return 'badge--vac';
  return 'badge--inactive';
}

function renderTablaEmpleados() {
  const tbody = document.getElementById('employeeTbody');
  const vacio = document.getElementById('employeeEmpty');
  const contador = document.getElementById('employeeCount');
  const lista = obtenerEmpleadosFiltrados();

  contador.textContent = `${lista.length} de ${empleados.length} empleados`;

  if (lista.length === 0) {
    tbody.innerHTML = '';
    vacio.hidden = false;
    return;
  }
  vacio.hidden = true;

  // Ciclo forEach para construir cada fila (Manipulación del DOM)
  const filasHtml = [];
  lista.forEach(function (emp) {
    filasHtml.push(`
      <tr data-id="${emp.id}">
        <td>
          <div class="person">
            <div class="person__avatar">${obtenerIniciales(emp.nombre)}</div>
            <div>
              <span class="person__name">${emp.nombre}</span>
              <span class="person__email">${emp.correo}</span>
            </div>
          </div>
        </td>
        <td>${emp.puesto}</td>
        <td>${emp.departamento}</td>
        <td>${formatearColones(emp.salario)}</td>
        <td>${formatearFecha(emp.ingreso)}</td>
        <td><span class="badge ${claseBadgeEstado(emp.estado)}">${emp.estado}</span></td>
        <td>
          <div class="rowActions">
            <button class="rowedit" title="Editar" data-id="${emp.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="rowdelete" title="Eliminar" data-id="${emp.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`);
  });

  tbody.innerHTML = filasHtml.join('');
}

function poblarFiltroDepartamentos() {
  const select = document.getElementById('deptFilter');
  DEPARTAMENTOS.forEach(function (dep) {
    const opcion = document.createElement('option');
    opcion.value = dep;
    opcion.textContent = dep;
    select.appendChild(opcion);
  });
}

/* ============================================================================
   8. REPORTES (reduce agrupado)
   ============================================================================ */
function renderReportes() {
  const stats = calcularEstadisticas();
  const contenedor = document.getElementById('reportCards');

  const promedioSalario = empleados.length ? Math.round(stats.nominaMensual / empleados.length) : 0;
  const proyectosCerrados = proyectos.filter(function (p) { return p.estado === 'Cierre'; }).length;

  const tarjetas = [
    { icono: 'fa-money-bill-trend-up', valor: formatearColones(promedioSalario), etiqueta: 'Salario promedio', color: 'var(--blue-600)' },
    { icono: 'fa-circle-check', valor: proyectosCerrados, etiqueta: 'Proyectos cerrados', color: 'var(--success)' },
    { icono: 'fa-user-clock', valor: empleados.filter(e => e.estado === 'Vacaciones').length, etiqueta: 'En vacaciones', color: 'var(--warning)' },
    { icono: 'fa-user-xmark', valor: empleados.filter(e => e.estado === 'Inactivo').length, etiqueta: 'Inactivos', color: 'var(--danger)' }
  ];

  contenedor.innerHTML = tarjetas.map(function (t) {
    return `
      <div class="card" style="--bar-color:${t.color}; --icon-color:${t.color}">
        <div class="card__top"><div class="card__icon"><i class="fa-solid ${t.icono}"></i></div></div>
        <div class="card__value">${t.valor}</div>
        <div class="card__label">${t.etiqueta}</div>
      </div>`;
  }).join('');

  // Agrupación con reduce: nómina y promedio por departamento
  const agrupado = DEPARTAMENTOS.reduce(function (acc, dep) {
    const miembros = empleados.filter(function (e) { return e.departamento === dep; });
    const total = miembros.reduce(function (sum, e) { return sum + e.salario; }, 0);
    acc.push({
      departamento: dep,
      cantidad: miembros.length,
      total: total,
      promedio: miembros.length ? Math.round(total / miembros.length) : 0
    });
    return acc;
  }, []);

  const tbody = document.getElementById('reportTbody');
  tbody.innerHTML = agrupado.map(function (fila) {
    return `
      <tr>
        <td>${fila.departamento}</td>
        <td>${fila.cantidad}</td>
        <td>${formatearColones(fila.total)}</td>
        <td>${formatearColones(fila.promedio)}</td>
      </tr>`;
  }).join('');
}

/* ============================================================================
   9. VALIDACIONES DE FORMULARIO
   ============================================================================ */
function mostrarErrorCampo(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const errorSpan = document.querySelector(`[data-error-for="${idCampo}"]`);
  campo.classList.toggle('is-invalid', Boolean(mensaje));
  if (errorSpan) errorSpan.textContent = mensaje || '';
}

function validarCorreo(correo) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

function validarFormularioEmpleado() {
  let esValido = true;

  const nombre = document.getElementById('empNombre').value.trim();
  const correo = document.getElementById('empCorreo').value.trim();
  const puesto = document.getElementById('empPuesto').value.trim();
  const departamento = document.getElementById('empDepartamento').value;
  const salario = document.getElementById('empSalario').value;
  const ingreso = document.getElementById('empIngreso').value;

  if (nombre.length < 3) {
    mostrarErrorCampo('empNombre', 'Ingrese un nombre válido (mínimo 3 caracteres).');
    esValido = false;
  } else mostrarErrorCampo('empNombre', '');

  if (!validarCorreo(correo)) {
    mostrarErrorCampo('empCorreo', 'Ingrese un correo electrónico válido.');
    esValido = false;
  } else mostrarErrorCampo('empCorreo', '');

  if (puesto.length < 3) {
    mostrarErrorCampo('empPuesto', 'Indique el puesto del colaborador.');
    esValido = false;
  } else mostrarErrorCampo('empPuesto', '');

  if (!departamento) {
    mostrarErrorCampo('empDepartamento', 'Seleccione un departamento.');
    esValido = false;
  } else mostrarErrorCampo('empDepartamento', '');

  if (!salario || Number(salario) < APP_CONFIG.salarioMinimo) {
    mostrarErrorCampo('empSalario', `El salario mínimo permitido es ${formatearColones(APP_CONFIG.salarioMinimo)}.`);
    esValido = false;
  } else mostrarErrorCampo('empSalario', '');

  if (!ingreso) {
    mostrarErrorCampo('empIngreso', 'Seleccione la fecha de ingreso.');
    esValido = false;
  } else mostrarErrorCampo('empIngreso', '');

  return esValido;
}

/* ============================================================================
   10. CRUD DE EMPLEADOS
   ============================================================================ */
function abrirModalEmpleado(idEmpleado) {
  const modal = document.getElementById('modalOverlay');
  const titulo = document.getElementById('modalTitle');
  const form = document.getElementById('employeeForm');
  form.reset();
  ['empNombre','empCorreo','empPuesto','empDepartamento','empSalario','empIngreso'].forEach(function (id) {
    mostrarErrorCampo(id, '');
  });

  if (idEmpleado) {
    const emp = empleados.find(function (e) { return e.id === idEmpleado; });
    if (!emp) return;
    titulo.innerHTML = '<i class="fa-solid fa-user-pen"></i> Editar empleado';
    document.getElementById('empId').value = emp.id;
    document.getElementById('empNombre').value = emp.nombre;
    document.getElementById('empCorreo').value = emp.correo;
    document.getElementById('empPuesto').value = emp.puesto;
    document.getElementById('empDepartamento').value = emp.departamento;
    document.getElementById('empSalario').value = emp.salario;
    document.getElementById('empIngreso').value = emp.ingreso;
    document.getElementById('empEstado').value = emp.estado;
  } else {
    titulo.innerHTML = '<i class="fa-solid fa-user-plus"></i> Nuevo empleado';
    document.getElementById('empId').value = '';
  }

  modal.classList.add('is-open');
}

function cerrarModalEmpleado() {
  document.getElementById('modalOverlay').classList.remove('is-open');
}

function manejarEnvioFormularioEmpleado(evento) {
  evento.preventDefault();
  if (!validarFormularioEmpleado()) {
    mostrarToast('Revise los campos marcados en rojo.', 'error');
    return;
  }

  const id = document.getElementById('empId').value;

  const empleadoObjeto = {
    id: id || generarId(),
    nombre: document.getElementById('empNombre').value.trim(),
    correo: document.getElementById('empCorreo').value.trim(),
    puesto: document.getElementById('empPuesto').value.trim(),
    departamento: document.getElementById('empDepartamento').value,
    salario: Number(document.getElementById('empSalario').value),
    ingreso: document.getElementById('empIngreso').value,
    estado: document.getElementById('empEstado').value
  };

  if (id) {
    empleados = empleados.map(function (e) { return e.id === id ? empleadoObjeto : e; });
    registrarActividad('fa-user-pen', `Se actualizó la información de ${empleadoObjeto.nombre}`);
    mostrarToast('Empleado actualizado correctamente.');
  } else {
    empleados.push(empleadoObjeto);
    registrarActividad('fa-user-plus', `Se registró a ${empleadoObjeto.nombre} en ${empleadoObjeto.departamento}`);
    mostrarToast('Empleado agregado correctamente.');
  }

  guardarEnStorage(STORAGE_KEYS.EMPLEADOS, empleados);
  cerrarModalEmpleado();
  refrescarVistaCompleta();
}

function eliminarEmpleado(idEmpleado) {
  const emp = empleados.find(function (e) { return e.id === idEmpleado; });
  if (!emp) return;
  const confirmado = window.confirm(`¿Eliminar a ${emp.nombre} del directorio?`);
  if (!confirmado) return;

  empleados = empleados.filter(function (e) { return e.id !== idEmpleado; });
  guardarEnStorage(STORAGE_KEYS.EMPLEADOS, empleados);
  registrarActividad('fa-user-xmark', `Se eliminó a ${emp.nombre} del directorio`);
  mostrarToast('Empleado eliminado.');
  refrescarVistaCompleta();
}

/* ============================================================================
   11. NAVEGACIÓN ENTRE VISTAS (SPA simple)
   ============================================================================ */
const TITULOS_VISTA = {
  dashboard: { titulo: 'Panel general', ruta: 'Inicio / Panel general' },
  empleados: { titulo: 'Empleados', ruta: 'Inicio / Empleados' },
  proyectos: { titulo: 'Proyectos', ruta: 'Inicio / Proyectos' },
  reportes: { titulo: 'Reportes', ruta: 'Inicio / Reportes' },
  configuracion: { titulo: 'Configuración', ruta: 'Inicio / Configuración' }
};

function cambiarVista(nombreVista) {
  document.querySelectorAll('.view').forEach(function (seccion) {
    seccion.classList.toggle('is-active', seccion.id === 'view-' + nombreVista);
  });
  document.querySelectorAll('.navlink[data-view]').forEach(function (boton) {
    boton.classList.toggle('is-active', boton.dataset.view === nombreVista);
  });

  const info = TITULOS_VISTA[nombreVista];
  if (info) {
    document.getElementById('viewTitle').textContent = info.titulo;
    document.getElementById('viewBreadcrumb').textContent = info.ruta;
  }

  cerrarSidebarMovil();
}

/* ============================================================================
   12. NOTIFICACIONES (datos de ejemplo)
   ============================================================================ */
function renderNotificaciones() {
  const lista = document.getElementById('notifList');
  const notificaciones = [
    { icono: 'fa-user-plus', titulo: 'Nuevo colaborador', detalle: 'Mariana Zúñiga se unió a RRHH', tiempo: 'Hace 2h' },
    { icono: 'fa-diagram-project', titulo: 'Proyecto actualizado', detalle: 'SINPE alcanzó 60% de avance', tiempo: 'Hace 5h' },
    { icono: 'fa-triangle-exclamation', titulo: 'Ticket urgente', detalle: 'Prioridad alta asignada al equipo', tiempo: 'Ayer' }
  ];
  lista.innerHTML = notificaciones.map(function (n) {
    return `<li><i class="fa-solid ${n.icono}"></i><span><strong>${n.titulo}</strong>${n.detalle}<br><small>${n.tiempo}</small></span></li>`;
  }).join('');
}

/* ============================================================================
   13. PERFIL / CONFIGURACIÓN
   ============================================================================ */
function cargarPerfilEnCabecera() {
  document.getElementById('userNameLabel').textContent = perfilUsuario.nombre;
  document.getElementById('userRoleLabel').textContent = perfilUsuario.puesto;
  document.getElementById('userAvatar').textContent = obtenerIniciales(perfilUsuario.nombre);

  document.getElementById('profName').value = perfilUsuario.nombre;
  document.getElementById('profRole').value = perfilUsuario.puesto;
  document.getElementById('profEmail').value = perfilUsuario.correo;
}

function validarFormularioPerfil() {
  let valido = true;
  const nombre = document.getElementById('profName').value.trim();
  const puesto = document.getElementById('profRole').value.trim();
  const correo = document.getElementById('profEmail').value.trim();

  if (nombre.length < 3) { mostrarErrorCampo('profName', 'Ingrese un nombre válido.'); valido = false; }
  else mostrarErrorCampo('profName', '');

  if (puesto.length < 3) { mostrarErrorCampo('profRole', 'Ingrese un puesto válido.'); valido = false; }
  else mostrarErrorCampo('profRole', '');

  if (!validarCorreo(correo)) { mostrarErrorCampo('profEmail', 'Ingrese un correo válido.'); valido = false; }
  else mostrarErrorCampo('profEmail', '');

  return valido;
}

function manejarEnvioPerfil(evento) {
  evento.preventDefault();
  if (!validarFormularioPerfil()) return;

  perfilUsuario = {
    nombre: document.getElementById('profName').value.trim(),
    puesto: document.getElementById('profRole').value.trim(),
    correo: document.getElementById('profEmail').value.trim()
  };
  guardarEnStorage(STORAGE_KEYS.PERFIL, perfilUsuario);
  cargarPerfilEnCabecera();

  const exito = document.getElementById('profileSuccess');
  exito.hidden = false;
  setTimeout(function () { exito.hidden = true; }, 2600);
  mostrarToast('Perfil actualizado.');
}

/* ============================================================================
   14. TEMA CLARO / OSCURO
   ============================================================================ */
function aplicarTema(modoOscuro) {
  document.body.classList.toggle('theme-dark', modoOscuro);
  document.getElementById('themeSwitch').checked = modoOscuro;
  guardarEnStorage(STORAGE_KEYS.TEMA, modoOscuro);
}

function alternarTema() {
  const activoActualmente = document.body.classList.contains('theme-dark');
  aplicarTema(!activoActualmente);
}

/* ============================================================================
   15. SIDEBAR MÓVIL
   ============================================================================ */
function abrirSidebarMovil() {
  document.getElementById('sidebar').classList.add('is-open');
  document.getElementById('overlay').classList.add('is-open');
}
function cerrarSidebarMovil() {
  document.getElementById('sidebar').classList.remove('is-open');
  document.getElementById('overlay').classList.remove('is-open');
}

/* ============================================================================
   16. REFRESCO GENERAL
   ============================================================================ */
function refrescarVistaCompleta() {
  renderTarjetas();
  renderDistribucionDepartamentos();
  renderActividad();
  renderProyectosMini();
  renderProyectosGrid();
  renderTablaEmpleados();
  renderReportes();
}

/* ============================================================================
   17. EVENTOS PRINCIPALES
   ============================================================================ */
function inicializarEventos() {

  // --- Navegación del menú lateral y menú de usuario ---
  document.querySelectorAll('[data-view]').forEach(function (elemento) {
    elemento.addEventListener('click', function () {
      cambiarVista(elemento.dataset.view);
      document.getElementById('userMenu').classList.remove('is-open');
    });
  });

  document.getElementById('btnMenu').addEventListener('click', abrirSidebarMovil);
  document.getElementById('overlay').addEventListener('click', cerrarSidebarMovil);

  // --- Menú de usuario y notificaciones (toggle con click) ---
  document.getElementById('userChip').addEventListener('click', function (evento) {
    evento.stopPropagation();
    document.getElementById('userMenu').classList.toggle('is-open');
    document.getElementById('notifPanel').classList.remove('is-open');
  });

  document.getElementById('btnNotif').addEventListener('click', function (evento) {
    evento.stopPropagation();
    document.getElementById('notifPanel').classList.toggle('is-open');
    document.getElementById('userMenu').classList.remove('is-open');
  });

  document.addEventListener('click', function () {
    document.getElementById('userMenu').classList.remove('is-open');
    document.getElementById('notifPanel').classList.remove('is-open');
  });

  ['btnLogout', 'menuLogout'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function () {
      const salir = window.confirm('¿Desea cerrar la sesión actual?');
      if (salir) mostrarToast('Sesión cerrada. ¡Hasta pronto!');
    });
  });

  // --- Tema claro/oscuro ---
  document.getElementById('btnTheme').addEventListener('click', alternarTema);
  document.getElementById('themeSwitch').addEventListener('change', function (evento) {
    aplicarTema(evento.target.checked);
  });

  // --- Modal de empleado ---
  document.getElementById('btnNewEmployee').addEventListener('click', function () { abrirModalEmpleado(null); });
  document.getElementById('btnCloseModal').addEventListener('click', cerrarModalEmpleado);
  document.getElementById('btnCancelModal').addEventListener('click', cerrarModalEmpleado);
  document.getElementById('modalOverlay').addEventListener('click', function (evento) {
    if (evento.target.id === 'modalOverlay') cerrarModalEmpleado();
  });
  document.getElementById('employeeForm').addEventListener('submit', manejarEnvioFormularioEmpleado);

  // --- Delegación de eventos sobre la tabla (editar / eliminar) ---
  document.getElementById('employeeTbody').addEventListener('click', function (evento) {
    const botonEditar = evento.target.closest('.rowedit');
    const botonEliminar = evento.target.closest('.rowdelete');
    if (botonEditar) abrirModalEmpleado(botonEditar.dataset.id);
    if (botonEliminar) eliminarEmpleado(botonEliminar.dataset.id);
  });

  // --- Búsqueda y filtros de la tabla ---
  document.getElementById('employeeSearch').addEventListener('input', function (evento) {
    filtroTexto = evento.target.value.trim().toLowerCase();
    renderTablaEmpleados();
  });
  document.getElementById('deptFilter').addEventListener('change', function (evento) {
    filtroDepartamento = evento.target.value;
    renderTablaEmpleados();
  });

  // --- Búsqueda global del encabezado (filtra tabla y cambia de vista) ---
  document.getElementById('globalSearch').addEventListener('input', function (evento) {
    const valor = evento.target.value.trim();
    if (valor.length > 0) {
      filtroTexto = valor.toLowerCase();
      document.getElementById('employeeSearch').value = valor;
      cambiarVista('empleados');
      renderTablaEmpleados();
    }
  });

  // --- Ordenamiento de columnas ---
  document.querySelectorAll('#employeeTable thead th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () {
      const campo = th.dataset.sort;
      if (ordenTabla.campo === campo) {
        ordenTabla.direccion = ordenTabla.direccion === 'asc' ? 'desc' : 'asc';
      } else {
        ordenTabla = { campo: campo, direccion: 'asc' };
      }
      renderTablaEmpleados();
    });
  });

  // --- Formulario de perfil ---
  document.getElementById('profileForm').addEventListener('submit', manejarEnvioPerfil);

  // --- Restablecer datos de ejemplo ---
  document.getElementById('btnResetData').addEventListener('click', function () {
    const confirmar = window.confirm('Esto borrará los cambios guardados y restaurará los datos de ejemplo. ¿Continuar?');
    if (!confirmar) return;
    localStorage.removeItem(STORAGE_KEYS.EMPLEADOS);
    localStorage.removeItem(STORAGE_KEYS.PROYECTOS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVIDAD);
    inicializarDatos();
    refrescarVistaCompleta();
    mostrarToast('Datos de ejemplo restaurados.');
  });

  // --- Validación en tiempo real dentro del modal (evento input) ---
  ['empNombre','empCorreo','empPuesto','empSalario','empIngreso'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      if (document.getElementById(id).classList.contains('is-invalid')) {
        validarFormularioEmpleado();
      }
    });
  });
}

/* ============================================================================
   18. ARRANQUE DE LA APLICACIÓN
   ============================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  inicializarDatos();
  poblarFiltroDepartamentos();
  cargarPerfilEnCabecera();
  renderNotificaciones();
  aplicarTema(leerDeStorage(STORAGE_KEYS.TEMA, false));
  inicializarEventos();
  refrescarVistaCompleta();
  cambiarVista('dashboard');
});