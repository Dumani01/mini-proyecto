const formulario = document.getElementById("formulario");

const nombre = document.getElementById("nombre");

const precio = document.getElementById("precio");

const stock = document.getElementById("stock");

const tabla = document.getElementById("tablaProductos");

let productos = [];

let indiceEditar = -1;

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const producto={

        nombre:nombre.value,

        precio:precio.value,

        stock:stock.value

    };

    if(indiceEditar===-1){

        productos.push(producto);

    }else{

        productos[indiceEditar]=producto;

        indiceEditar=-1;

    }

    formulario.reset();

    mostrarProductos();

});

function mostrarProductos(){

    tabla.innerHTML="";

    productos.forEach(function(producto,index){

        tabla.innerHTML+=`

        <tr>

            <td>${producto.nombre}</td>

            <td>$${producto.precio}</td>

            <td>${producto.stock}</td>

            <td>

                <button
                    class="editar"
                    onclick="editarProducto(${index})">

                    Editar

                </button>

                <button
                    class="eliminar"
                    onclick="eliminarProducto(${index})">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}

function eliminarProducto(indice){

    if(confirm("¿Eliminar producto?")){

        productos.splice(indice,1);

        mostrarProductos();

    }

}

function editarProducto(indice){

    nombre.value=productos[indice].nombre;

    precio.value=productos[indice].precio;

    stock.value=productos[indice].stock;

    indiceEditar=indice;

}