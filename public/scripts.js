const cards = document.querySelectorAll(".card")
const buttons = document.querySelectorAll(".buttons")
const lists = document.querySelectorAll("ul")

for (let [index, card] of cards.entries()) {
    card.addEventListener("click", function() {
        window.location.href = `/recipes/${index}`
    })
}

for (let [index, button] of buttons.entries()) {
    button.addEventListener("click", function() {
        if (button.innerHTML == "Hide") {
            lists[index].classList.add("hidden_list")
            button.innerHTML = "Show"
        } else {
            lists[index].classList.remove("hidden_list")
            button.innerHTML = "Hide"
        }

    })
}

// ADMIN

const buttonsAdmin = document.querySelectorAll(".card-button-admin a")

for (let [index, button] of buttonsAdmin.entries()) {
    console.log(button)
    button.addEventListener("click", function() {
        button.href = `/admin/recipes/${index}`
    })
}