// Setup

document.getElementById("set-room-size-btn").addEventListener("click", update_room)
document.getElementById("room-row").setAttribute("value", 6)
document.getElementById("room-col").setAttribute("value", 5)
document.getElementById("students-count").setAttribute("value", 3)

var student_list = []

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


update_room()

// Students

class Student {
    /**
     * The class representing a student.
     * @param {Number} id The unique ID for the student. TODO: Change the type to string.
     * @param {Number} r The row number of the student's seat; 0-indexed; -1 for unassigned.
     * @param {Number} c The column number of the student's seat; 0-indexed; -1 for unassigned.
     * @param {Array<Number>} avoid The list of student IDs to avoid in the + area (4 seats).
     * @param {Array<Number>} avoid_plus The list of student IDs to avoid in the # area (8 seats).
     */
    constructor(id, r, c, avoid, avoid_plus) {
        this.id = id
        this.r = r
        this.c = c
        this.avoid = avoid
        this.avoid_plus = avoid_plus
    }

    get card() {
        let card = document.createElement("div")
        card.classList.add("card")

        let card_body = document.createElement("div")
        card_body.classList.add("card-body")

        let card_title = document.createElement("h5")
        card_title.classList.add("card-title")
        card_title.textContent = "Student #" + this.id
        card_body.appendChild(card_title)

        let card_subtitle = document.createElement("h6")
        card_subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary")
        card_subtitle.textContent = "Seat: R" + (this.r > 0 ? this.r : "?") + "C" + (this.c > 0 ? this.c : "?")
        card_body.appendChild(card_subtitle)

        let card_text_A = document.createElement("p")
        card_text_A.classList.add("card-text")
        card_text_A.textContent = "Avoid: " + this.avoid.join(", ")
        card_body.appendChild(card_text_A)

        let card_text_B = document.createElement("p")
        card_text_B.classList.add("card-text")
        card_text_B.textContent = "Avoid Plus: " + this.avoid_plus.join(", ")
        card_body.appendChild(card_text_B)

        card.appendChild(card_body)
        return card
    }
}