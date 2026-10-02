const usuario = JSON.parse(
    sessionStorage.getItem("usuario")
);

const btnPanelAdmin =
    document.getElementById("btnPanelAdmin");

if (btnPanelAdmin) {

    if (
        usuario &&
        (
            usuario.rol === "administrador" ||
            usuario.rol === "admin"
        )
    ) {

        btnPanelAdmin.style.display =
            "inline-block";

    } else {

        btnPanelAdmin.style.display =
            "none";
    }
}