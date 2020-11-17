const modalOverlay = document.querySelector(".modal_overlay")
const cards = document.querySelectorAll(".card")

for (let card of cards) {
    card.addEventListener("click", function() {
        console.log(card.querySelector(".card_title").innerHTML)
        modalOverlay.classList.add("active")
        document.querySelector(".modal_image img").src = card.querySelector("img").src
        document.querySelector(".modal_title").innerHTML = card.querySelector(".card_title").innerHTML
        document.querySelector(".modal_author").innerHTML = card.querySelector(".card_author").innerHTML
    })
}

document.querySelector(".close_modal").addEventListener("click", function() {
    modalOverlay.classList.remove("active")
})