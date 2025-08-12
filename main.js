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
 * buscar foto
*****************************************************/
const formBuscarFoto = document.getElementById('buscar-foto');
const submitBtn = document.getElementById('submitBtn');
const apiKey = "LeQ2cjWt8XSnsAD9fUjXUzFrchwiI3ySkAh7iUvA"; // tu API Key real

formBuscarFoto.onsubmit = function (e) {
    e.preventDefault();
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Buscando...';
    submitBtn.disabled = true;    
    
    const fechaFotoValor = fechaFoto.value;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${fechaFotoValor}`;
    const contenedor = document.getElementById('mostrar-imagen');
    contenedor.innerHTML = '';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data.date); // ver en consola
            const idBtn = 'favBtn_' + Date.now();

            contenedor.innerHTML = `
                <div class="container text-center">
                    <div class="row align-items-center">
                        <div class="col-6">
                            <img src="${data.url}" class="img-fluid text-center" alt="...">
                        </div>
                        <div class="col-6">
                            <p class="fs-3">${data.title}</p>
                            <p>${data.date}</p>
                            <p class="card-text mb-3">${data.explanation}</p>
                            <div
                            <button type="button" id="${idBtn}" class="btn btn-primary m-5">Guardar en mis favoritos</button>
                        </div>
                    </div>
                </div>                                
            `;

            document.getElementById(idBtn).addEventListener('click', () => {
                guardarFavorito(data.title, data.explanation, data.url, data.date);
            });

            formBuscarFoto.reset();
            submitBtn.textContent = 'Ver foto';
            submitBtn.disabled = false;

        })
        .catch(error => console.error("Error al conectar con la API:", error))
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
}


/*****************************************************
 * mostrar favoritos
*****************************************************/
const btnFavoritos = document.getElementById('btnFavoritos');


btnFavoritos.addEventListener("click", () => {
    cargarFavoritos();
});

function cargarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const seccFavoritos = document.getElementById('favoritos');
    const seccCards = document.getElementById('cards');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    seccFavoritos.classList.add('d-none');
    mensajeVacio.classList.add('d-none');
    seccCards.innerHTML = '';

    if (favoritos.length > 0) {
        favoritos.forEach(f => {
            const divCard = document.createElement('div');
            divCard.classList.add('col')

            divCard.innerHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="${f.url}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#explicacionFoto">
                        Ver más
                        </button>
                    </div>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="explicacionFoto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header pb-0">
                            <div>
                                <p class="fw-bold mb-0" id="exampleModalLabel" style="border:2px solid red;">${f.titulo}</p>
                                <p class="mx-3"style="border:2px solid blue;">${f.fecha}</p>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${f.explicacion}</p>
                        </div>
                    </div>
                </div>
                </div>
            `;
            seccCards.appendChild(divCard);
        });
        seccFavoritos.classList.remove('d-none');

    } else {
        seccFavoritos.classList.remove('d-none');
        mensajeVacio.classList.remove('d-none');
    }
}

/*****************************************************
 * mostrar imagen de hoy por defecto
*****************************************************/
document.addEventListener('DOMContentLoaded', function () {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${fechaActual}`;
    const contenedor = document.getElementById('mostrar-imagen');
    contenedor.innerHTML = '';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data.date); // ver en consola
            const idBtn = 'favBtn_' + Date.now();

            contenedor.innerHTML = `
                <div class="container text-center">
                    <div class="row align-items-center">
                        <div class="col-6">
                        <img src="${data.url}" class="img-fluid text-center" alt="...">
                        </div>
                        <div class="col-6">
                        <p class="fs-3">${data.title}</p>
                        <p>${data.date}</p>
                        <p class="card-text">${data.explanation}</p>
                        <button type="button" id="${idBtn}" class="btn btn-primary">Guardar en mis favoritos</button>
                        </div>
                    </div>
                </div>                                
            `;

            document.getElementById(idBtn).addEventListener('click', () => {
                guardarFavorito(data.title, data.explanation, data.url, data.date);
            });

            formBuscarFoto.reset();
            submitBtn.textContent = 'Ver foto';
            submitBtn.disabled = false;

        })
        .catch(error => console.error("Error al conectar con la API:", error))
});