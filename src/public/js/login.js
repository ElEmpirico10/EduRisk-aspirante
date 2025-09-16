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
  
  await fetch("/auth/login", {
    method: "POST",
    body: formData
  })
    .then(async (res) => {
      const contentType = res.headers.get("Content-Type") || "";
      const status = res.status;
      const clone = res.clone();

      if (!res.ok || !contentType.includes("application/json")) {
        const htmlError = await clone.text();

        console.group("🚨 Error de respuesta inesperada");
        console.log("📄 Content-Type:", contentType);
        console.log("📊 Status:", status);
        console.log("🧾 HTML recibido:\n", htmlError);
        console.groupEnd();

        throw new Error(`Respuesta inválida (${status})`);
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data.status == "success") {
        showToast(data.message, '#27F527');
        return;
      }

      if (data.status == "error") {
        showToast(data.message, '#f52727ff');
        console.log("Ha ocurrido un error inesperado en la obtencion de datos");
      }
    })
    .catch((err) => {
      console.log("Error en la conexion o JSON invalido: ", err.message);
      showToast("Error en la conexion. Por favor, intenta de nuevo", '#f52727ff');
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
