document.addEventListener("DOMContentLoaded", () => {
    // Referencias de intercambio de formularios
    const loginContainer = document.getElementById("loginContainer");
    const registerContainer = document.getElementById("registerContainer");
    const goToRegister = document.getElementById("goToRegister");
    const goToLogin = document.getElementById("goToLogin");

    // Formularios independientes
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Intercambio visual entre Login y Registro
    goToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginContainer.classList.add("hide");
        registerContainer.classList.remove("hide");
    });

    goToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerContainer.classList.add("hide");
        loginContainer.classList.remove("hide");
    });

    // Control de visibilidad de contraseñas (ojito)
    document.querySelectorAll(".toggle-pass").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input");
            const icon = btn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.setAttribute("data-lucide", "eye-off");
            } else {
                input.type = "password";
                icon.setAttribute("data-lucide", "eye");
            }
            lucide.createIcons();
        });
    });

    // Petición de Registro
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("regName").value.trim();
        const correo = document.getElementById("regEmail").value.trim();
        const contrasena = document.getElementById("regPassword").value.trim();

        try {
            const respuesta = await fetch("http://localhost:3000/api/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, correo, contrasena })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(resultado.mensaje);
                registerForm.reset();
                goToLogin.click();
            } else {
                alert(resultado.error);
            }
        } catch (err) {
            alert("Error al conectar con el servidor backend.");
        }
    });

    // Petición de Login con Redirección por Rol
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const correo = document.getElementById("email").value.trim();
        const contrasena = document.getElementById("password").value.trim();

        try {
            const respuesta = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert("¡Bienvenido de nuevo, " + resultado.nombre + "!");
                
                // REDIRECCIÓN INTELIGENTE SEGÚN EL ROL DE MYSQL
                if (resultado.rol === "admin") {
                    window.location.href = "../dashboard/dashboard.html";
                } else if (resultado.rol === "chofer") {
                    window.location.href = "../UIchof/index.html";
                } else {
                    window.location.href = "../Pasajero/Inicio/inicio.html"; // Pasajero común
                }
            } else {
                alert(resultado.error);
            }
        } catch (err) {
            alert("Error al conectar con el servidor backend.");
        }
    });
});