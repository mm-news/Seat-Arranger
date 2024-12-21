// Setup

document.getElementById("set-room-size-btn").addEventListener("click", update_room)
document.getElementById("room-row").setAttribute("value", 6)
document.getElementById("room-col").setAttribute("value", 5)
document.getElementById("students-count").setAttribute("value", 3)

var student_list = []

update_room()


// Room

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
    document.getElementById("arranging-area").innerHTML = "" // Clear the arranging area
    console.log("Recreating table")

    // Get the number of rows and columns from the input boxes
    let rows = parseInt(document.getElementById("room-row").value)
    let cols = parseInt(document.getElementById("room-col").value)

    // Create a table element
    let new_arranging_area = document.getElementById("arranging-area")

    // Populate the table with rows and columns
    for (let i = 0; i < rows; i++) {
        const r = document.createElement("div")
        r.classList.add("row")
        for (let j = 0; j < cols; j++) {
            const c = document.createElement("div")
            c.classList.add("card-cell", "col")
            r.appendChild(c)
        }
        new_arranging_area.appendChild(r)
    }

    document.getElementById("arranging-area").innerHTML = new_arranging_area.innerHTML
}
