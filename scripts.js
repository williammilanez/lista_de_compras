// Obtendo elementos do formulário
const form = document.getElementById("add-item-form")
const user_input = document.getElementById("new-item")
const submit_button = document.querySelector('button[type="submit"]')

const items_list = document.getElementById("items-list")
const all_remove_icons = document.querySelectorAll("li.item > img")

const error = document.querySelector("div.add-item > p")

// manipulando o input new-item para receber apenas letras
user_input.addEventListener("input", () => {
    const onlyLettersRegex = /[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g; // permite somente letras acentuadas e espaços
    user_input.value = user_input.value.replace(onlyLettersRegex, "");
});

// botão de submit
form.onsubmit = (event) => {
    event.preventDefault()

    // gerenciamento da mensagem de error
    if (user_input.value == "") {
        user_input.classList.add("error-border")
        error.classList.remove("hidden")
        
        submit_button.blur()
        
        user_input.addEventListener("keypress", () => {
            user_input.classList.remove("error-border")
            error.classList.add("hidden")
        })

        return
    } else {
        user_input.classList.remove("error-border")
        error.classList.add("hidden")
    }

    // adicionar entrada digitada como um item de lista
    addItem(user_input.value)
    user_input.value = ""

    // botão de desfocagem após utilização
    submit_button.blur()
}

// inserir novo item no topo da lista
function addItem(name) {
    // <li class="item"></li>
    const new_item = document.createElement("li")
    new_item.classList.add("item")
    
    // <input type="checkbox">
    const new_checkbox = document.createElement("input")
    new_checkbox.setAttribute("type", "checkbox")
    new_item.append(new_checkbox)

    // <span> user_input.value </span>
    const new_name = document.createElement("span")
    new_name.textContent = name
    new_item.append(new_name)

    // <img>
    const new_remove_img = document.createElement("img")
    new_remove_img.setAttribute("src", "./assets/trash-bin.svg")
    new_remove_img.setAttribute("alt", "Ícone de lata de lixo")
    new_item.append(new_remove_img)

    // tornar o ícone da lixeira do novo item capaz de chamar a função deleteEvent() quando clicado
    deleteEvent(new_remove_img)
    

    // insira o novo <li class="item"> na <ul role="list" id="items-list"> na primeira posição
    items_list.prepend(new_item)
}

// tornar o ícone da lixeira do item de exemplo pré-fabricado capaz de chamar a função deleteEvent()
all_remove_icons.forEach((selected_element) => {
    deleteEvent(selected_element)
})

// remover item da lista (ul#items-list) quando clicado, somente no respectivo ícone da lixeira
function deleteEvent(selected_element) {
    selected_element.addEventListener("click", (event) => {
        const warning_box = document.getElementById("warning-wrapper")
        const warning_message = warning_box.querySelector("p")
        const removed_item = event.target.closest("li.item")
        const close_icon = document.getElementById("close-icon")

        // exibe o nome do item na mensagem de aviso
        warning_message.querySelector("span.removed").textContent = removed_item.querySelector("span").textContent

        // exibe mensagem de aviso completa após a remoção do item
        warning_box.classList.remove("hidden")

        // remove-o da lista
        removed_item.remove()

        // fecha a mensagem de aviso, somente quando clicado no ícone "X"
        close_icon.addEventListener("click", () => {
            warning_box.classList.add("hidden")
        })
    })
}