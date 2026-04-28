const form = document.querySelector(".form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const toggle = document.querySelector("#togglePassword");
const pupil = document.querySelector("#pupil");


form.addEventListener("submit",(e) => {
  e.preventDefault();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  if(emailValue===""){
    alert("El campo de correo electrónico no puede estar vacío.");
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)){
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }
  if(passwordValue===""){
    alert("El campo de contraseña no puede estar vacío.");
    return;
  }

  if(passwordValue.length < 6){
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if(!/[A-Z]/.test(passwordValue)){
    alert("La contraseña debe contener al menos una letra mayúscula.");
    return;
  }

  if(!/[0-9]/.test(passwordValue)){
    alert("La contraseña debe contener al menos un número.");
    return;
  }

    alert("¡Inicio de sesión exitoso!");
});



let open = false;

toggle.addEventListener("click", () => {
  open = !open;

  if (open) {
    password.type = "text";

    // ojo abierto
    pupil.style.transform = "scale(1.4)";
    pupil.style.opacity = "1";
  } else {
    password.type = "password";

    // ojo cerrado (mini efecto)
    pupil.style.transform = "scale(0.3)";
    pupil.style.opacity = "0.5";
  }
});