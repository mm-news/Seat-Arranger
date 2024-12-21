document.getElementById("set-room-size-btn").addEventListener("click", update_room)
document.getElementById("room-row").setAttribute("value", 6)
document.getElementById("room-col").setAttribute("value", 5)
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
    document.getElementById("arranging-area").innerHTML = "" // Clear the arranging area
    console.log("Recreating table")

    // Get the number of rows and columns from the input boxes
    let rows = parseInt(document.getElementById("room-row").value)
    let cols = parseInt(document.getElementById("room-col").value)

    // Create a table element
    let table = document.getElementById("arranging-area")

    // Populate the table with rows and columns
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr")
        for (let j = 0; j < cols; j++) {
            const td = document.createElement("td")
            td.classList.add("card-cell") // Add class for styling
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }

    // Append the table to the arranging area
    document.getElementById("arranging-area") = table
}