document.addEventListener("load", function () {
    document.getElementById("room-row").addEventListener("change", update_room)
    document.getElementById("room-col").addEventListener("change", update_room)
})

/**
 * Updates the room layout based on the event triggered.
 * @param {Event} event - The event object.
 */
function update_room(event) {
    if (confirm("This is gonna clear all your seats, are you sure?")) {
        document.getElementById("arranging-area").innerHTML = ""
        let r = document.getElementById("room-row").getAttribute("value")
        let c = document.getElementById("room-col").getAttribute("value")
        for (let i = 0; i < r; i++) {
            //TODO: rewrite the table element
        }
    }
}