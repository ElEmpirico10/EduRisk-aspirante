async function login() {
  const formData = new FormData();

  formData.append(
    "tipoIdentificacion",
    document.getElementById("documentType__selected-id").value
  );
  formData.append(
    "identificacion",
    document.getElementById("document-number").value
  );
  formData.append("password", document.getElementById("password").value);

  console.log(JSON.stringify(Object.fromEntries(formData)));

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      if (data.status == "success") {
        alert(data.message);
        const ubicacionActual = window.location.href;
        localStorage.setItem("jwt_token", data.token);
        let firstParam = data.token;

        window.location.href = `${ubicacionActual}?tokenUser=${firstParam}`;
        return;
      }

      if (data.status == "error") {
        alert(data.message);
        console.log("Ha ocurrido un error inesperado en la obtencion de datos");
      }
    })
    .catch((err) => {
      console.log("Error en la conexion o JSON invalido: ", err);
      alert("Error en la conexion. Por favor, intenta de nuevo");
    });
}

function formLoginSubmission() {
  const form = document.getElementById("formContent");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await login();
    });
  }
}

formLoginSubmission();
