// Setup

document.getElementById("set-room-size-btn").addEventListener("click", update_room)
document.getElementById("set-students-count-btn").addEventListener("click", () => {
    let current_count = student_list.length
    for (let i = 0; i < parseInt(document.getElementById("students-count").value); i++) {
        add_student(current_count + i + 1)
    }
})

document.getElementById("room-row").setAttribute("value", 6)
document.getElementById("room-col").setAttribute("value", 5)
document.getElementById("students-count").setAttribute("value", 5)

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
        card.classList.add("card", "vh-30")
        card.setAttribute("id", "student-" + this.id)
        card.addEventListener("click", () => show_student_preferences(this.id))

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

function add_student(id) {
    let student = new Student(id, -1, -1, [], [])
    student_list.push(student)
    document.getElementById("students-list").appendChild(student.card)
}

function remove_student(id) {
    let student = student_list.find(s => s.id == id)
    if (student) {
        student_list = student_list.filter(s => s.id != id)
        document.getElementById("student-" + id).remove()
    }
}

function show_student_preferences(id) {
    let student = student_list.find(s => s.id == id)
    if (student) {
        let info_box = document.getElementById("student-info") // TODO: Set the class of the student `bg-primary`
        info_box.innerHTML = ""

        let cardbody = document.createElement("div")
        cardbody.classList.add("card-body")

        let title = document.createElement("h5")
        title.classList.add("card-title")
        title.textContent = "Student #" + student.id

        let set_avoid = document.createElement("select") // TODO: Add a label
        set_avoid.classList.add("form-select")
        set_avoid.setAttribute("multiple", "")
        set_avoid.setAttribute("id", "set-avoid")

        student_list.forEach(s => {
            let option = document.createElement("option")
            option.setAttribute("value", s.id)
            option.textContent = "Student #" + s.id
            if (student.avoid.includes(s.id)) {
                option.setAttribute("selected", "")
            }
            set_avoid.appendChild(option)
        })

        let set_avoid_plus = document.createElement("select")
        set_avoid_plus.classList.add("form-select")
        set_avoid_plus.setAttribute("multiple", "")
        set_avoid_plus.setAttribute("id", "set-avoid-plus")

        student_list.forEach(s => {
            let option = document.createElement("option")
            option.setAttribute("value", s.id)
            option.textContent = "Student #" + s.id
            if (student.avoid_plus.includes(s.id)) {
                option.setAttribute("selected", "")
            }
            set_avoid_plus.appendChild(option)
        }) // TODO: use checkboxes instead

        let save_button = document.createElement("button")
        save_button.classList.add("btn", "btn-primary")
        save_button.textContent = "Save"

        cardbody.appendChild(title)
        cardbody.appendChild(set_avoid)
        cardbody.appendChild(set_avoid_plus)
        cardbody.appendChild(save_button)
        info_box.appendChild(cardbody)
    }
}