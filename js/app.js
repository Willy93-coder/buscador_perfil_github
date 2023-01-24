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
        const objData = dates(data);
        const component = githubProfileComponent(objData);
        hydrateDOM(sectionProfileEl, component);
        addClickEvent(objData);
    } catch (error) {
        error = errorComponent(error);
        hydrateDOM(sectionProfileEl, error);
    } finally {
        formEl.reset();
    }
}

// Función que me crea un objeto con los datos de la api
const dates = (data) => {
    const data2 = {
        id: data.id,
        name: data.name,
        bio: data.bio,
        avatar: data.avatar_url,
        url: data.html_url
    }
    return data2;
}

// Función para guardar perfiles en favoritos
const saveFavourites = (data) => {
    const localStorage = window.localStorage;
    const idString = JSON.stringify(data.id);
    const dataString = JSON.stringify(data);
    const localStorageKeysArray = Object.keys(localStorage);
    const exist = localStorageKeysArray.includes(idString);
    if (!exist) {
        localStorage.setItem(idString, dataString);
        hydrateDOMFavouriteProfiles(idString);
        removeComponent(idString);
    }
}

// Función para eliminar perfiles de favoritos
const removeFavouritesById = (id) => {
    const localStorage = window.localStorage;
    console.log("id es: " + typeof id);
    const localStorageKeysArray = Object.keys(localStorage);
    // const exist = localStorageKeysArray.includes(id);
    // if(exist) {
    //     localStorage.removeItem(id);
    // }
    for (let i = 0; i < localStorageKeysArray.length; i++){
        if (localStorageKeysArray[i] === id) {
            //localStorage.removeItem(id);
            delete localStorage[localStorageKeysArray[i]];
        }
    }
}

// Eliminar componente del DOM
const removeComponentById = (id) => {
    const profileComponentEl = document.getElementById(id);
    profileComponentEl.remove();
}

// Componente para pintar perfiles favoritos
const hydrateDOMFavouriteProfiles = (localStorageKey) => {
    const localStorage = window.localStorage;
    const getLocalStorage = localStorage.getItem(localStorageKey);
    const objLocalStorageData = JSON.parse(getLocalStorage);
    const favouriteProfile = githubFavouriteProfile(objLocalStorageData);
    const sectionFavouritesProfiles = document.getElementById('favourites');
    sectionFavouritesProfiles.innerHTML += favouriteProfile;
}

// Función para persistir los componentes
const persistentComponentDOM = () => {
    const localStorage = window.localStorage;
    console.log("localStorage: " + localStorage);
    const localStorageKeysArray = Object.keys(localStorage);
    localStorageKeysArray.forEach(element => {
        hydrateDOMFavouriteProfiles(element);
        removeClickEvent(element)
    });
    console.log("Se está ejecutando persistentComponentDOM");
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
            <i class="bi bi-plus-circle" id="addFavourites"></i>
        </div>
    `;
    return template;
}

// Componente de favoritos
const githubFavouriteProfile = (localStorageData) => {
    const { id, name, avatar, url, bio } = localStorageData;
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
        <div>
            <h2>${message}</h2>
        </div>
    `;
    return template;
}

// Función que pinta en el DOM
const hydrateDOM = (domEl, component) => {
    domEl.innerHTML = component;
}

// Evento click de añadir
const addClickEvent = (data) => {
    const plusIconEl = document.getElementById('addFavourites');
    plusIconEl.addEventListener('click', () => {
        saveFavourites(data);
    })
}

// Evento click de eliminar
const removeClickEvent = (id) => {
    const dashIconEl = document.getElementById(id);
    dashIconEl.addEventListener('click', () => {
        removeFavouritesById(id);
        removeComponentById(id)
    })
}

// Evento para lanzar el formulario
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    getProfileGithub();
})

document.addEventListener('DOMContentLoaded', () => {
    persistentComponentDOM();
})