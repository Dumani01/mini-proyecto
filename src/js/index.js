// Crear usuario por primera vez

if (!localStorage.getItem("usuario")) {

    localStorage.setItem("usuario", "admin");
    localStorage.setItem("password", "12345");

}

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const usuarioGuardado = localStorage.getItem("usuario");
    const passwordGuardada = localStorage.getItem("password");

    const mensaje = document.getElementById("mensaje");

    if(usuario === usuarioGuardado && password === passwordGuardada){

        localStorage.setItem("logueado", "true");

        window.location.href = "Dashboard.html";

    }else{

        mensaje.textContent = "Usuario o contraseña incorrectos";

    }

});