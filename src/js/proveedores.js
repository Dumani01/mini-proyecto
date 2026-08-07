// ==========================================
// 1. VARIABLES, ARREGLOS Y CONSTANTES
// ==========================================
const STORAGE_KEY = 'dashboard_suppliers_data';

// Variables de estado
let suppliers = []; // Arreglo principal
let isEditing = false;

// Elementos del DOM (Manipulación del DOM)
const supplierForm = document.getElementById('supplier-form');
const formTitle = document.getElementById('form-title');
const supplierIdInput = document.getElementById('supplier-id');
const companyInput = document.getElementById('company');
const contactInput = document.getElementById('contact');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const categorySelect = document.getElementById('category');

const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const searchInput = document.getElementById('search-input');
const tableBody = document.getElementById('suppliers-table-body');

// Arreglo con la lista de campos para validaciones (Ciclos y Métodos)
const formFields = [
  { id: 'company', name: 'Empresa' },
  { id: 'contact', name: 'Contacto' },
  { id: 'email', name: 'Correo' },
  { id: 'phone', name: 'Teléfono' },
  { id: 'category', name: 'Categoría' }
];

// ==========================================
// 2. INICIALIZACIÓN Y LOCALSTORAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderTable(suppliers);
  initEvents();
});

// Guardar datos en LocalStorage
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

// Cargar datos de LocalStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  // Condicional
  if (data) {
    suppliers = JSON.parse(data);
  } else {
    suppliers = [];
  }
}

// ==========================================
// 3. EVENTOS (Formularios e Inputs)
// ==========================================
function initEvents() {
  // Evento submit del formulario
  supplierForm.addEventListener('submit', handleFormSubmit);

  // Evento click cancelar edición
  btnCancel.addEventListener('click', resetForm);

  // Evento input para filtro dinámico (Métodos de arreglos)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Método de arreglo: filter
    const filtered = suppliers.filter(s => 
      s.company.toLowerCase().includes(query) || 
      s.contact.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });
}

// ==========================================
// 4. VALIDACIONES Y MANEJO DEL FORMULARIO
// ==========================================
function validateForm() {
  let isValid = true;
  clearErrors();

  // Ciclo para limpiar e inspeccionar reglas básicas
  formFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input.value.trim()) {
      showError(field.id, `El campo ${field.name} es obligatorio.`);
      isValid = false;
    }
  });

  // Validaciones condicionales avanzadas (Email y Teléfono)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value && !emailRegex.test(emailInput.value)) {
    showError('email', 'Ingrese un formato de correo válido.');
    isValid = false;
  }

  const phoneRegex = /^[0-9]{8,15}$/;
  if (phoneInput.value && !phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
    showError('phone', 'Ingrese un número telefónico válido (8 a 15 dígitos).');
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  formFields.forEach(field => {
    const errorEl = document.getElementById(`error-${field.id}`);
    if (errorEl) errorEl.textContent = '';
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  // Objeto Proveedor
  const supplierData = {
    id: isEditing ? supplierIdInput.value : Date.now().toString(),
    company: companyInput.value.trim(),
    contact: contactInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    category: categorySelect.value
  };

  if (isEditing) {
    // Método de arreglo: findIndex
    const index = suppliers.findIndex(s => s.id === supplierData.id);
    if (index !== -1) {
      suppliers[index] = supplierData;
    }
  } else {
    // Método de arreglo: push
    suppliers.push(supplierData);
  }

  saveToLocalStorage();
  renderTable(suppliers);
  resetForm();
}

// ==========================================
// 5. RENDERIZADO Y MANIPULACIÓN DEL DOM
// ==========================================
function renderTable(dataList) {
  tableBody.innerHTML = '';

  // Condicional si no hay datos
  if (dataList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">No hay proveedores registrados.</td>
      </tr>
    `;
    return;
  }

  // Ciclo / Método de arreglo: forEach
  dataList.forEach(supplier => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><strong>${escapeHTML(supplier.company)}</strong></td>
      <td>${escapeHTML(supplier.contact)}</td>
      <td>${escapeHTML(supplier.email)}</td>
      <td>${escapeHTML(supplier.phone)}</td>
      <td>${escapeHTML(supplier.category)}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-secondary btn-edit" data-id="${supplier.id}">Editar</button>
          <button class="btn btn-danger btn-delete" data-id="${supplier.id}">Eliminar</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Delegación de eventos para botones dinámicos Editar y Eliminar
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => editSupplier(e.target.dataset.id));
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => deleteSupplier(e.target.dataset.id));
  });
}

// Editar Proveedor (Consulta y carga al formulario)
function editSupplier(id) {
  // Método de arreglo: find
  const supplier = suppliers.find(s => s.id === id);
  if (!supplier) return;

  supplierIdInput.value = supplier.id;
  companyInput.value = supplier.company;
  contactInput.value = supplier.contact;
  emailInput.value = supplier.email;
  phoneInput.value = supplier.phone;
  categorySelect.value = supplier.category;

  isEditing = true;
  formTitle.textContent = 'Editar Proveedor';
  btnSave.textContent = 'Actualizar Proveedor';
  btnCancel.classList.remove('hidden');
  clearErrors();
}

// Eliminar Proveedor
function deleteSupplier(id) {
  if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
    // Método de arreglo: filter
    suppliers = suppliers.filter(s => s.id !== id);
    saveToLocalStorage();
    renderTable(suppliers);
    if (isEditing && supplierIdInput.value === id) {
      resetForm();
    }
  }
}

function resetForm() {
  supplierForm.reset();
  supplierIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Registrar Proveedor';
  btnSave.textContent = 'Guardar Proveedor';
  btnCancel.classList.add('hidden');
  clearErrors();
}

// Seguridad básica para inyección HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}