const formulario = document.getElementById("clienteForm");
const tablaClientes = document.getElementById("tablaClientes");

let clientes = [];
let editando = null;

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
  };

  if (editando !== null) {
    clientes[editando] = cliente;
    editando = null;
  } else {
    clientes.push(cliente);
  }

  formulario.reset();
  mostrarClientes();
});

function mostrarClientes() {
  tablaClientes.innerHTML = "";

  clientes.forEach((cliente, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>
                <button class="btn-editar" onclick="editarCliente(${index})">
                    Editar
                </button>

                <button class="btn-eliminar" onclick="eliminarCliente(${index})">
                    Eliminar
                </button>
            </td>
        `;

    tablaClientes.appendChild(fila);
  });
}

function editarCliente(index) {
  document.getElementById("nombre").value = clientes[index].nombre;

  document.getElementById("correo").value = clientes[index].correo;

  document.getElementById("telefono").value = clientes[index].telefono;

  document.getElementById("direccion").value = clientes[index].direccion;

  editando = index;
}

function eliminarCliente(index) {
  if (confirm("¿Desea eliminar este cliente?")) {
    clientes.splice(index, 1);
    mostrarClientes();
  }
}
