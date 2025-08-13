/*****************************************************
 * bloquear fechas futuras
*****************************************************/
const fechaFoto = document.getElementById('fechaFoto');

const hoy = new Date();
const dia = String(hoy.getDate()).padStart(2, '0');
const mes = String(hoy.getMonth() + 1).padStart(2, '0');
const anio = hoy.getFullYear();

const fechaActual = `${anio}-${mes}-${dia}`;

fechaFoto.setAttribute("max", fechaActual);

/*****************************************************
 * solicitud API
*****************************************************/
async function solicitudAPI(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.date); // ver en consola
        return {
            title: data.title,
            date: data.date,
            url: data.url,
            explanation: data.explanation
        };
    } catch (error) {
        return `Error al conectar con la API: ${error}`;
    }
}

/*****************************************************
 * buscar foto
*****************************************************/
const formBuscarFoto = document.getElementById('buscar-foto');
const submitBtn = document.getElementById('submitBtn');
const apiKey = "LeQ2cjWt8XSnsAD9fUjXUzFrchwiI3ySkAh7iUvA"; // tu API Key real

formBuscarFoto.onsubmit = async function (e) {
    e.preventDefault();
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Buscando...';
    submitBtn.disabled = true;

    const fechaFotoValor = fechaFoto.value;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${fechaFotoValor}`;

    const resultadoSolicitud = await solicitudAPI(url);
    if (typeof resultadoSolicitud === "string") {
        console.error(resultadoSolicitud);
    }
    else if (typeof resultadoSolicitud === "object") {
        mostrarFoto(resultadoSolicitud);
    }
}

function mostrarFoto(resultadoSolicitud) {
    const contenedor = document.getElementById('mostrar-imagen');
    contenedor.innerHTML = '';

    const idBtn = 'favBtn_' + Date.now();

    contenedor.innerHTML = `
        <div class="container text-center">
            <div class="row justify-content-center">
                <p class="fs-3">${resultadoSolicitud.title}</p>
                <p>${resultadoSolicitud.date}</p>
            </div>
            <div class="row align-items-center mt-3">
                <div class="col-6">
                    <img src="${resultadoSolicitud.url}" class="img-fluid text-center" alt="...">
                </div>
                <div class="col-6">
                    <p class="card-text">${resultadoSolicitud.explanation}</p>
                </div>
            </div>
            <div class="row justify-content-center mt-2">
                <button type="button" id="${idBtn}" class="btn btn-guardar mt-3 col-6">Guardar en mis favoritos</button>
            </div>
        </div>                                
    `;

    document.getElementById(idBtn).addEventListener('click', () => {
        guardarFavorito(resultadoSolicitud.title, resultadoSolicitud.explanation, resultadoSolicitud.url, resultadoSolicitud.date);
    });

    formBuscarFoto.reset();
    submitBtn.textContent = 'Ver foto';
    submitBtn.disabled = false;
}

/*****************************************************
 * guardar en favoritos
*****************************************************/
function guardarFavorito(ftitle, fexplanation, furl, fdate) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    ftitle = decodeURIComponent(ftitle);
    fexplanation = decodeURIComponent(fexplanation);
    furl = decodeURIComponent(furl);
    fdate = decodeURIComponent(fdate);
    if (!favoritos.find(f => f.fecha === fdate)) {
        favoritos.push({ titulo: ftitle, explicacion: fexplanation, url: furl, fecha: fdate });
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }

    cargarFavoritos();
}


/*****************************************************
 * mostrar favoritos
*****************************************************/
const btnFavoritos = document.getElementById('btnFavoritos');


btnFavoritos.addEventListener("click", () => {
    cargarFavoritos();
    document.getElementById("favoritos").scrollIntoView({
        behavior: "smooth" // desplazamiento suave
    });
});

function cargarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const seccFavoritos = document.getElementById('favoritos');
    const tituloFavoritos = document.getElementById('titulo-favoritos');
    const seccCards = document.getElementById('cards');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    seccFavoritos.classList.add('d-none');
    tituloFavoritos.classList.add('d-none');
    mensajeVacio.classList.add('d-none');
    seccCards.innerHTML = '';

    if (favoritos.length > 0) {
        favoritos.forEach(f => {
            const divCard = document.createElement('div');
            divCard.classList.add('col', 'm-0')

            divCard.innerHTML = `
        
                <div class="card text-bg-dark h-100">
                    <img src="${f.url}" class="card-img h-100" alt="${f.title}">
                    <div class="card-img-overlay">
                        <div class="card-title text-start">
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-card p-1" data-bs-toggle="modal" data-bs-target="#favBtn_${Date.now()}">
                            Ver más
                        </button>
                        </div>
                    </div>
                </div>
        
                <!-- Modal -->
                <div class="modal fade" id="favBtn_${Date.now()}">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header pb-0">
                            <div>
                                <p class="fw-bold mb-0" id="exampleModalLabel">${f.titulo}</p>
                                <p class="mx-3">${f.fecha}</p>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-start">${f.explicacion}</p>
                        </div>
                    </div>
                </div>
                </div>
            `;
            seccCards.appendChild(divCard);
        });
        seccFavoritos.classList.remove('d-none');
        tituloFavoritos.classList.remove('d-none');

    } else {
        seccFavoritos.classList.remove('d-none');
        mensajeVacio.classList.remove('d-none');
    }
}

/*****************************************************
 * mostrar imagen de hoy por defecto
*****************************************************/
document.addEventListener('DOMContentLoaded', async function () {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${fechaActual}`;
    
    const resultadoSolicitud = await solicitudAPI(url);
    if (typeof resultadoSolicitud === "string") {
        console.error(resultadoSolicitud);
    }
    else if (typeof resultadoSolicitud === "object") {
        mostrarFoto(resultadoSolicitud);
    }
    
    mostrarFoto(resultadoSolicitud);
});