var exampleModal = document.getElementById("exampleModal")
exampleModal.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var todotitle = button.getAttribute("data-bs-todotitle")
    const todo = button.getAttribute("data-bs-todo")
    const todoid = button.getAttribute("data-bs-todoid")

    const todoidselector = exampleModal.querySelector("#todoid")
    var todoTitleselector = exampleModal.querySelector("#todotitle")
    const todoselector = exampleModal.querySelector(".modal-body textarea")
    todoTitleselector.value = todotitle
    todoselector.value = todo
    todoidselector.value = todoid
})
// const cards_div_isempty = document.querySelector("#cards").innerHTML === ""
// console.log(cards_div_isempty)
let darkmode = document.querySelector("#darkmode-button")

let dark_local_storage = localStorage.getItem("dark-mode")

document.addEventListener("DOMContentLoaded", (e) => {
    if (dark_local_storage == null) {
        localStorage.setItem("dark-mode", "off")
    }
    if (dark_local_storage == "on") {
        document.documentElement.classList.toggle("dark-mode")
        document.querySelectorAll(".inverted").forEach((result) => {
            result.classList.toggle("invert")
        })
    }
})

darkmode.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode")
    document.querySelectorAll(".inverted").forEach((result) => {
        result.classList.toggle("invert")
    })
    if (dark_local_storage == "off") {
        localStorage.setItem("dark-mode", "on")
    } else if (dark_local_storage == "on") {
        localStorage.setItem("dark-mode", "off")
    }
})
