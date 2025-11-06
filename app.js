// Variables globales
let data = {};
let currentSection = 'inicio';
let currentCourse = null;

// Cargar datos desde data.json
async function loadData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        renderContent('inicio');
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para renderizar contenido
function renderContent(section, courseIndex = null) {
    const mainContent = document.getElementById('mainContent');
    const sectionData = data[section];

    if (!sectionData) return;

    // Añadir transición
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
        let html = '';

        // Si es un curso específico
        if (section === 'capacitaciones' && courseIndex !== null) {
            const curso = sectionData.cursos[courseIndex];
            currentCourse = courseIndex;

            html = `
                <button class="back-button" onclick="renderContent('capacitaciones')">
                    <i class="fas fa-arrow-left"></i>
                    Volver a Capacitaciones
                </button>
                <div class="content-row">
                    <div class="left-section">
                        <img src="${curso.imagen}" alt="${curso.titulo}">
                    </div>
                    <div class="right-section">
                        <h1 class="section-title">${curso.titulo}</h1>
                        <p class="section-description">${curso.descripcion}</p>
                        
                        <div class="course-info">
                            <div class="course-info-item">
                                <span class="course-info-label">Modalidad</span>
                                <span class="course-info-value">${curso.modalidad}</span>
                            </div>
                            <div class="course-info-item">
                                <span class="course-info-label">Duración</span>
                                <span class="course-info-value">${curso.horas}</span>
                            </div>
                            <div class="course-info-item">
                                <span class="course-info-label">Precio</span>
                                <span class="course-info-value">${curso.precio}</span>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="btn-custom" onclick="verMalla(${courseIndex})">
                                <i class="fas fa-list"></i> Ver Malla Curricular
                            </button>
                            <button class="btn-custom" onclick="descargarContenido('${curso.titulo}')">
                                <i class="fas fa-download"></i> Descargar Contenido
                            </button>
                            <button class="btn-custom" onclick="matricularCurso('${curso.titulo}')">
                                <i class="fas fa-graduation-cap"></i> Matricularme
                            </button>
                        </div>

                        <div id="mallaContainer" class="hidden" style="margin-top: 30px; padding: 25px; background: rgba(30, 144, 255, 0.1); border-radius: 15px; border: 2px solid rgba(30, 144, 255, 0.4);">
                            <h3 style="color: #1e90ff; margin-bottom: 20px; text-shadow: 0 0 8px rgba(30, 144, 255, 0.6);">Malla Curricular</h3>
                            <ul class="back-list">
                                ${curso.malla.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
        // Si es capacitaciones (vista general)
        else if (section === 'capacitaciones' && courseIndex === null) {
            html = `
                <div class="content-row">
                    <div class="left-section">
                        <img src="${sectionData.imagen}" alt="${sectionData.titulo}">
                    </div>
                    <div class="right-section">
                        <h1 class="section-title">${sectionData.titulo}</h1>
                        <p class="section-description">${sectionData.descripcion}</p>
                        
                        <div class="cards-container">
                            ${sectionData.cursos.map((curso, index) => `
                                <div class="flip-card">
                                    <div class="flip-card-inner">
                                        <div class="flip-card-front">
                                            <h3 class="card-title">${curso.titulo}</h3>
                                            <p class="card-description">${curso.descripcion.substring(0, 100)}...</p>
                                            <button class="btn-custom" onclick="renderContent('capacitaciones', ${index})">
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        // Otras secciones con planes
        else if (sectionData.planes) {
            html = `
                <div class="content-row">
                    <div class="left-section">
                        <img src="${sectionData.imagen}">
                    </div>
                    <div class="right-section">
                        <h1 class="section-title">${sectionData.titulo}</h1>
                        <p class="section-description">${sectionData.descripcion.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                
                <div class="plans-section">
                    <h2 class="plans-title">Nuestros Planes</h2>
                    <div class="cards-container">
                        ${sectionData.planes.map((plan, index) => `
                            <div class="flip-card" id="card-${section}-${index}">
                                <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                        <div class="card-icon">${plan.icon}</div>
                                        <h3 class="card-title">${plan.nombre}</h3>
                                        <p class="card-description">${plan.descripcion}</p>
                                        <button class="btn-custom" onclick="flipCard('${section}', ${index})">
                                            Ver Más
                                        </button>
                                    </div>
                                    <div class="flip-card-back">
                                        <h3 class="card-title">${plan.nombre}</h3>
                                        <p class="card-description">${plan.direccion}</p>
                                        <ul class="back-list">
                                            ${plan.caracteristicas.map(item => `<li>${item}</li>`).join('')}
                                        </ul>
                                        <button class="btn-custom" onclick="flipCard('${section}', ${index})" style="margin-top: auto;">
                                            Volver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        // Secciones simples (inicio, quienes-somos)
        else {
            html = `
                <div class="content-row">
                    <div class="left-section">
                        <img src="${sectionData.imagen}">
                    </div>
                    <div class="right-section">
                        <h1 class="section-title">${sectionData.titulo}</h1>
                        <p class="section-description">${sectionData.descripcion.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `;

            // Si es la página de inicio, agregar la sección de servicios
            if (section === 'inicio') {
                html += `
                    <div class="services-section">
                        <h2 class="services-title">Nuestros Servicios</h2>
                        <div class="services-grid">
                            <div class="service-card" onclick="navigateToSection('formalizacion')">
                                <span class="material-symbols-outlined material-icons">person_pin</span>
                                <div class="service-card-title">Formalización de Empresa</div>
                            </div>
                            <div class="service-card" onclick="navigateToSection('oficina-virtual')">
                                <span class="material-icons">location_city</span>
                                <div class="service-card-title">Oficina Virtual</div>
                            </div>
                            <div class="service-card" onclick="navigateToSection('software')">
                                <span class="material-symbols-outlined material-icons">terminal</span>
                                <div class="service-card-title">Desarrollo de Software</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        mainContent.innerHTML = html;
        currentSection = section;
        
        // Actualizar estado de navegación
        history.pushState({ section: section }, '', 'index.html');
        
        // Scroll al inicio antes del fade in
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // En móviles, también hacer scroll del main-container
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Fade in
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 50);
    }, 300);
}

// Función para voltear cards
function flipCard(section, index) {
    const card = document.getElementById(`card-${section}-${index}`);
    if (card) {
        card.classList.toggle('flipped');
    }
}

// Función para ver malla curricular
function verMalla(courseIndex) {
    const mallaContainer = document.getElementById('mallaContainer');
    if (mallaContainer) {
        mallaContainer.classList.toggle('hidden');
    }
}

// Función para descargar contenido
function descargarContenido(cursoTitulo) {
    alert(`Descargando contenido de: ${cursoTitulo}\n\nNota: En producción, esto descargará un PDF desde la raíz del proyecto.`);
    // En producción: window.location.href = `/pdfs/${cursoTitulo.replace(/\s+/g, '_')}.pdf`;
}

// Función para matricularse
function matricularCurso(cursoTitulo) {
    const mensaje = encodeURIComponent(`Hola, quiero matricularme en el curso ${cursoTitulo}`);
    const telefono = '56921951687';
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
}

// Función para rutear al contrato
function routeToContract(event, path) {
    event.preventDefault();
    
    const mainContent = document.getElementById('mainContent');
    
    // Añadir clase de transición
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        mainContent.innerHTML = '<div class="loading-message" style="text-align: center; padding: 50px; color: #1e90ff; font-size: 1.2rem;">Cargando Contrato de Servicios...</div>';
        
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el contrato: ${response.statusText}`);
                }
                return response.text();
            })
            .then(htmlContent => {
                // Crear un documento temporal para parsear el HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                
                // Extraer solo el contenido del form-container
                const formContainer = doc.querySelector('.form-container');
                
                if (formContainer) {
                    // Crear wrapper con estilos del contrato
                    const wrapper = document.createElement('div');
                    wrapper.className = 'contract-wrapper';
                    wrapper.innerHTML = `
                        <button class="back-button" onclick="renderContent('inicio'); history.pushState(null, '', 'index.html');">
                            <i class="fas fa-arrow-left"></i>
                            Volver al Inicio
                        </button>
                        ${formContainer.outerHTML}
                    `;
                    
                    mainContent.innerHTML = wrapper.outerHTML;
                    
                    // Reinicializar SignaturePad después de cargar el contenido
                    initializeSignaturePad();
                    
                    // Actualizar URL y estado
                    history.pushState({ section: 'contrato' }, '', path);
                    currentSection = 'contrato';
                    
                    // Fade in
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                    }, 50);
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    throw new Error('No se encontró el contenedor del formulario');
                }
            })
            .catch(error => {
                console.error(error);
                mainContent.innerHTML = `
                    <div class="error-message" style="text-align: center; padding: 50px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff4444; margin-bottom: 20px;"></i>
                        <h3 style="color: #1e90ff;">Error al cargar el contrato</h3>
                        <p style="color: #cccccc;">${error.message}</p>
                        <button class="btn-custom" onclick="renderContent('inicio'); history.pushState(null, '', 'index.html');" style="margin-top: 20px;">
                            Volver al Inicio
                        </button>
                    </div>
                `;
                mainContent.style.opacity = '1';
            });
    }, 300);
}

// Función para inicializar SignaturePad
function initializeSignaturePad() {
    const canvas = document.getElementById("signatureCanvas");
    if (canvas) {
        window.signaturePad = new SignaturePad(canvas);
    }
}

// Manejar navegación del navegador (botones atrás/adelante)
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.section) {
        if (event.state.section === 'contrato') {
            routeToContract(new Event('click'), 'asesores/contrato_servicios.html');
        } else {
            renderContent(event.state.section);
        }
    } else {
        renderContent('inicio');
    }
});

// Botón flotante de WhatsApp
function initWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const mensaje = encodeURIComponent('Hola, me pueden agendar una reunión');
            const telefono = '56921951687';
            window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
        });
    }
}

// Navegación vertical
function initNavigation() {
    document.querySelectorAll('.nav-item-vertical').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            renderContent(section);
        });
    });
}

// Función auxiliar para hacer scroll al inicio en las cards de servicios
function navigateToSection(section) {
    renderContent(section);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initWhatsAppButton();
    initNavigation();
});