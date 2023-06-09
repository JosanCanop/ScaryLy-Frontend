/*import { checkTokenOff } from "./tokenoff";

checkTokenOff()
*/

// Seleccionar los elementos del DOM para los botones
const changeUserDataButton = document.querySelector('#changeUserData');
const saveUserDataButton = document.querySelector('#saveUserData');

//inputs
const nickName = document.getElementById("username")
const userName = document.getElementById("name")
const surName = document.getElementById("surname")
const userEmail = document.getElementById("email")
//iduser
let userId = 0

// Agregar un eventListener al botón "Modificar datos de usuario"
changeUserDataButton.addEventListener('click', () => {
    // Cambiar la clase CSS "hidden" del botón "Guardar cambios" a "show"
    saveUserDataButton.classList.remove('hidden');
    nickName.disabled = false
    userName.disabled = false
    surName.disabled = false
    nickName.classList.remove('text-white')
    userName.classList.remove('text-white')
    surName.classList.remove('text-white')
    nickName.classList.add('text-gray-700')
    userName.classList.add('text-gray-700')
    surName.classList.add('text-gray-700')
});

async function obtenerDatosUser() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch(urlBase + '/users/me', requestOptions)


        if (!response.ok) {

            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "login.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json()
        showUserData(data)

    } catch (error) {
        console.log(error)
    }
}

function showUserData(data) {

    userId = data.id
    nickName.value = data.username
    userName.value = data.name
    surName.value = data.surname
    userEmail.value = data.email
}

obtenerDatosUser()

form.addEventListener('submit', (e) => {
    e.preventDefault()
    updateDatosUser(form)
})

async function updateDatosUser(form) {
    try {
        const formData = new FormData(form)
        const urlencoded = new URLSearchParams(formData).toString()
        const response = await fetch(urlBase + '/users/' + userId, {
            method: "PUT",
            body: urlencoded,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        swal({
            title: "¡Usuario modificado!",
            text: "Datos guardados correctamente",
            icon: "success",
            button: "Continuar",
        }).then(function () {
            location.reload()
        });;
    } catch (error) {
        console.log(error)
    }
}

async function deleteUser() {
    try {
        const response = await fetch(urlBase + '/users/' + userId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            redirect: 'follow'
        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
    } catch (error) {
        console.log(error)
    }
}

function askDelete() {
    swal({
        title: "¿Estas seguro que quieres eliminar tu cuenta?",
        text: "¡Una vez borrada, no podras recuperarla!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deleteUser()
                swal("¡Buff! ¡Tú cuenta ha sido borrada :(!", {
                    icon: "success",
                }).then(function () {
                    location.replace('index.html')
                });
            }
        });
}