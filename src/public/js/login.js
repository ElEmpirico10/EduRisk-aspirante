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
  console.log(formData);

  await fetch("/auth/login", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status == "success") {
        localStorage.setItem("id_aspirante", data.id);
        localStorage.setItem("id_examen", data.id_examen);
        showToast(data.message, "green");
        setTimeout(() => {
          window.location.href = "/exam/";
        }, 3000);

        return;
      }

      if (data.status == "error") {
        showToast(data.message, "red");
      }
    })
    .catch((err) => {
      console.log("Error en la conexion o JSON invalido: ", err);
      showToast("Error en la conexion. Por favor, intenta de nuevo", "red");
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
