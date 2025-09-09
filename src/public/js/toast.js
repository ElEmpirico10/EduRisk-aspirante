// Crear el contenedor si no existe
(function() {
    if (!document.getElementById("toast-container")) {
        const container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
})();

function showToast(message, color = "#333", duration = 3000) {
    const container = document.getElementById("toast-container");

    // Si ya hay un toast, lo eliminamos
    const existingToast = container.querySelector(".toast");
    if (existingToast) {
        existingToast.remove();
    }

    // Crear nuevo toast
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.backgroundColor = color;
    toast.textContent = message;

    container.appendChild(toast);

    // Mostrar animación
    setTimeout(() => toast.classList.add("show"), 100);

    // Ocultar y eliminar después de duración
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, duration);
}
