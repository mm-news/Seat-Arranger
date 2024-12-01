document.getElementById("set-room-size-btn").addEventListener("click", update_room)
update_room()

/**
 * Updates the room layout based on the event triggered.
 * @param {Event} event - The event object.
 */
function update_room(event) {
    //TODO: Move items back to the students list
    console.log("Updating room layout")
    if (event) {
        if (!confirm("This is gonna clear all your seats, are you sure?")) {
            return
        }
    }
    document.getElementById("arranging-area").innerHTML = "" // FIXME
    alert()
    console.log("Recreating table")
    let r = document.getElementById("room-row").getAttribute("value")
    let c = document.getElementById("room-col").getAttribute("value")
    let new_table = ""
    for (let i = 0; i < r; i++) {
        new_table += '<tr>'
        for (let j = 0; j < c; j++) {
            new_table += '<td></td>'
        }
        new_table += "</tr>"
    }
    document.getElementById("arranging-area").innerHTML = new_table
}