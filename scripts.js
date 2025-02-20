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
    // normaliza o nome (remove espaços extras e converte para minúsculas para evitar duplicatas com diferenças de caixa)
    const formattedName = name.trim().toLowerCase();

    // verifica se já existe um item com o mesmo nome na lista
    const existingItems = document.querySelectorAll("li.item span");
    for (const item of existingItems) {
        if (item.textContent.trim().toLowerCase() === formattedName) {
            alert("Este item já consta na listagem!");
            return; // impede a adição do item duplicado
        }
    }

    // criar <li class="item">
    const new_item = document.createElement("li");
    new_item.classList.add("item");

    // criar <input type="checkbox">
    const new_checkbox = document.createElement("input");
    new_checkbox.setAttribute("type", "checkbox");
    new_item.append(new_checkbox);

    // criar <span> com o nome formatado
    const new_name = document.createElement("span");
    new_name.textContent = name.trim(); // Mantém a formatação original para exibição
    new_item.append(new_name);

    // criar <img> (inicialmente escondida)
    const new_remove_img = document.createElement("img");
    new_remove_img.classList.add("trash-bin");
    new_remove_img.setAttribute("src", "./assets/trash-bin.svg");
    new_remove_img.setAttribute("alt", "Ícone de lata de lixo");
    new_remove_img.style.display = "none"; // Esconder a lixeira inicialmente
    new_item.append(new_remove_img);

    // tornar o ícone da lixeira do novo item capaz de chamar a função deleteEvent()
    deleteEvent(new_remove_img);

    // adicionar evento para exibir/ocultar a lixeira ao marcar o checkbox
    new_checkbox.addEventListener("change", () => {
        new_remove_img.style.display = new_checkbox.checked ? "inline-block" : "none";
    });

    // inserir o novo <li class="item"> na lista
    items_list.prepend(new_item);
}


document.addEventListener("DOMContentLoaded", () => {
    // seleciona todos os itens já cadastrados
    const existing_items = document.querySelectorAll("li.item");

    existing_items.forEach((item) => {
        const checkbox = item.querySelector("input[type='checkbox']");
        const trash_icon = item.querySelector("img.trash-bin");

        // esconde a lixeira no início
        trash_icon.style.display = "none";

        // adiciona evento ao checkbox
        checkbox.addEventListener("change", () => {
            trash_icon.style.display = checkbox.checked ? "inline-block" : "none";
        });
    });
});

// tornar o ícone da lixeira do item de exemplo pré-fabricado capaz de chamar a função deleteEvent()
all_remove_icons.forEach((selected_element) => {
    deleteEvent(selected_element)
})

// remover item da lista (ul#items-list) quando clicado, somente no respectivo ícone da lixeira
function deleteEvent(selected_element) {
    selected_element.addEventListener("click", (event) => {
        const warning_box = document.getElementById("warning-wrapper");
        const warning_message = warning_box.querySelector("p");
        const removed_item = event.target.closest("li.item");
        const close_icon = document.getElementById("close-icon");

        // verifica se a largura da tela é menor ou igual a 640px
        if (window.matchMedia("(max-width: 640px)").matches) {
            warning_message.textContent = "Item removido com sucesso!";
        } else {
            // exibe o nome do item na mensagem de aviso
            warning_message.innerHTML = `O item<strong>&nbsp;<span class="removed"></span>&nbsp;</strong> foi removido da sua lista!`;
            warning_message.querySelector("span.removed").textContent = removed_item.querySelector("span").textContent;
        }

        // exibe mensagem de aviso completa após a remoção do item
        warning_box.classList.remove("hidden");

        // remove o item da lista
        removed_item.remove();

        // faz a mensagem sumir automaticamente após 5 segundos
        setTimeout(() => {
            warning_box.classList.add("hidden");
        }, 5000);

        // fecha a mensagem de aviso quando clicado no "X"
        close_icon.addEventListener("click", () => {
            warning_box.classList.add("hidden");
        });
    });
}