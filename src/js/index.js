document.addEventListener("DOMContentLoaded", () => {

    const datos = {
        usuarios: 125,
        ventas: 89,
        productos: 45,
        pedidos: 32
    };

    document.getElementById("usuarios").textContent = datos.usuarios;
    document.getElementById("ventas").textContent = datos.ventas;
    document.getElementById("productos").textContent = datos.productos;
    document.getElementById("pedidos").textContent = datos.pedidos;

});