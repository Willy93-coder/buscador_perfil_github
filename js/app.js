const inputEl = document.getElementById('search');
const formEl = document.getElementById('form');
const sectionProfileEl = document.getElementById('profile');
const favouritesEl = document.getElementById('favourites');


const URL = "https://api.github.com/users/";
const ERROR_MESSAGE = "El usuario no existe";

// Función para obtener el perfil de github y pintarlo en el DOM
const getProfileGithub = async () => {
    const GITHUB_PROFILE = inputEl.value;
    try {
        const res = await fetch(`${URL}${GITHUB_PROFILE}`);
        if(!res.ok) throw new Error (ERROR_MESSAGE);
        const data = await res.json();
        const objData = datesFromApi(data);
        const component = githubProfileComponent(objData);
        hydrateDOM(sectionProfileEl, component);
        removeClickEvent(objData.id);
    } catch (error) {
        error = errorComponent(error);
        hydrateDOM(sectionProfileEl, error);
    } finally {
        formEl.reset();
    }
}

// Función que me crea un objeto con los datos de la api
const datesFromApi = (data) => {
    const data2 = {
        id: data.id,
        name: data.name,
        bio: data.bio,
        avatar: data.avatar_url,
        url: data.html_url
    }
    return data2;
}

// Eliminar componente del DOM
const removeComponentById = (id) => {
    const profileComponentEl = document.getElementById(id);
    profileComponentEl.remove();
}

// Componente perfil github
const githubProfileComponent = (data) => {
    const { id, name, bio, avatar, url } = data;
    const template = `
        <div class="profile-card" id=${id}>
            <div class="photo-container">
                <img src="${avatar}" alt="${name}">
            </div>
            <div class="data-container">
                <div class="description">
                    <h2>${name}</h2>
                    <p>${bio}</p>
                    <a  href="${url}" target="_blank">
                        <i class="bi bi-github"></i>
                    </a>
                </div>
            </div>
            <i class="bi bi-dash-circle" id="remove${id}"></i>
        </div>
    `;
    return template;
}

// Componente de error
const errorComponent = (error) => {
    const { message } = error;
    const template = `
        <div class="message-container">
            <h2 class="error-message">${message}</h2>
        </div>
    `;
    return template;
}

// Función que pinta en el DOM
const hydrateDOM = (domEl, component) => {
    domEl.innerHTML = component;
}

// Evento click de eliminar
const removeClickEvent = (id) => {
    const dashIconEl = document.getElementById(id);
    dashIconEl.addEventListener('click', () => {
        removeComponentById(id)
    })
}

// Evento para lanzar el formulario
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    getProfileGithub();
})