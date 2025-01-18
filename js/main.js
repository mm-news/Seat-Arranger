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

/** @type {Array<Student>} */
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
    for (let i = 1; i <= rows; i++) {
        const r = document.createElement("div")
        r.classList.add("row")
        for (let j = 1; j <= cols; j++) {
            const c = document.createElement("div")
            c.classList.add("card-cell", "col", "seat-card")
            c.setAttribute("id", "seat-" + i + "-" + j)
            c.setAttribute("data-seat-row", i)
            c.setAttribute("data-seat-col", j)
            c.setAttribute("ondragover", "seat_card_dragover_handler(event)") // Why not addEventListener?
            c.setAttribute("ondrop", "seat_card_drop_handler(event)") // Because it doesn't work :)
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
     * @param {Number} r The row number of the student's seat; 1-indexed; -1 for unassigned.
     * @param {Number} c The column number of the student's seat; 1-indexed; -1 for unassigned.
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
        card.classList.add("card", "vh-30", "student-card")
        card.setAttribute("data-student-id", this.id)
        card.setAttribute("id", "student-" + this.id)
        card.setAttribute("draggable", "true")
        card.addEventListener("click", () => show_student_preferences(this.id))
        card.addEventListener("dragstart", student_card_dragstart_handler)

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
    flush_student_cards()
}

// TODO: Add a remove student button
function remove_student(id) {
    let student = student_list.find(s => s.id == id)
    if (student) {
        student_list = student_list.filter(s => s.id != id)
        document.getElementById("student-" + id).remove()
    }
}

function flush_student_cards() {
    document.getElementById("students-list").innerHTML = ""
    student_list.forEach(s => {
        document.getElementById("students-list").appendChild(s.card)
    })
}

// Students Info

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

        let configure_avoid = generate_student_avoid_form(student)

        let save_button = document.createElement("button")
        save_button.classList.add("btn", "btn-primary")
        save_button.textContent = "Save"
        save_button.addEventListener("click", (e) => {
            let avoid = []
            let avoid_plus = []
            student_list.forEach(s => {
                if (s.id == student.id) {
                    return
                }
                if (document.getElementById("avoid-student-" + s.id).checked) {
                    avoid.push(s.id)
                }
                if (document.getElementById("avoid-plus-student-" + s.id).checked) {
                    avoid_plus.push(s.id)
                }
            })
            student.avoid = avoid
            student.avoid_plus = avoid_plus
            console.log("Updated student: ", student)
            flush_student_cards()
        })

        cardbody.appendChild(title)
        cardbody.appendChild(configure_avoid)
        cardbody.appendChild(save_button)
        info_box.appendChild(cardbody)
    } else {
        console.error("Student not found: ", id)
    }
}

/**
 * Generate a form to set the avoid list for a student.
 * @param {Student} student_id the ID of the student to generate the form for
 */
function generate_student_avoid_form(student) {

    let set_avoid = document.createElement("table")
    set_avoid.setAttribute("id", "set-avoid")
    set_avoid.classList.add("table")
    set_avoid.appendChild(get_thead_4_avoid())

    let table_body = document.createElement("tbody")

    student_list.forEach(s => {
        if (s.id == student.id) {
            return
        }
        let checkbox_row = document.createElement("tr")
        checkbox_row.setAttribute("id", "avoid-student-row-" + s.id)

        let student_avoid_checkbox = document.createElement("input")
        student_avoid_checkbox.setAttribute("type", "checkbox")
        student_avoid_checkbox.setAttribute("id", "avoid-student-" + s.id)
        student_avoid_checkbox.classList.add("form-check-input")

        // Uncheck the avoid plus checkbox when it's checked
        student_avoid_checkbox.addEventListener("click", (e) => {
            if (e.target.checked) {
                document.getElementById("avoid-plus-student-" + s.id).checked = false
            }
        })

        if (student.avoid.includes(s.id)) {
            student_avoid_checkbox.setAttribute("checked", "")
        }

        let student_avoid_plus_checkbox = document.createElement("input")
        student_avoid_plus_checkbox.setAttribute("type", "checkbox")
        student_avoid_plus_checkbox.setAttribute("id", "avoid-plus-student-" + s.id)
        student_avoid_plus_checkbox.classList.add("form-check-input")

        // Uncheck the avoid checkbox when it's checked
        student_avoid_plus_checkbox.addEventListener("click", (e) => {
            if (e.target.checked) {
                document.getElementById("avoid-student-" + s.id).checked = false
            }
        })

        if (student.avoid_plus.includes(s.id)) {
            student_avoid_plus_checkbox.setAttribute("checked", "")
        } // TODO: simplify this

        let th = document.createElement("th")
        th.setAttribute("scope", "row")
        th.textContent = "#" + s.id

        let td_avoid = document.createElement("td")
        td_avoid.appendChild(student_avoid_checkbox)

        let td_avoid_plus = document.createElement("td")
        td_avoid_plus.appendChild(student_avoid_plus_checkbox)

        checkbox_row.appendChild(th)
        checkbox_row.appendChild(td_avoid)
        checkbox_row.appendChild(td_avoid_plus)

        table_body.appendChild(checkbox_row)
        set_avoid.appendChild(table_body)
    })
    return set_avoid
}

function get_thead_4_avoid() {
    let thead = document.createElement("thead")
    let tr = document.createElement("tr")
    let titles = ["Id", "Avoid+", "Avoid#"]
    titles.forEach(text => {
        let th = document.createElement("th")
        th.setAttribute("scope", "col")
        th.textContent = text
        tr.appendChild(th)
    })
    thead.appendChild(tr)
    return thead
}

// Drag and Drop

/**
 * This is called when the drag event is triggered on the student card.
 * @param {Event} ev the drag event.
 */
function student_card_dragstart_handler(ev) {
    if (!ev.target.classList.contains("student-card")) {
        return
    }
    console.log("drag start: ", ev.target.getAttribute("data-student-id"))

    ev.dataTransfer.setData("text/plain", ev.target.getAttribute("data-student-id"))
    ev.dataTransfer.dropEffect = "link"
}

function seat_card_dragover_handler(ev) {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "link"
}

/**
 * The is called when the drop event is triggered on the seat card.
 * @param {Event} ev the drop event
 */
function seat_card_drop_handler(ev) {
    // TODO: limit the number of students in the same seat
    console.log("drop: ", ev.dataTransfer.getData("text/plain"))
    console.log("target: ", ev.target.id)
    ev.preventDefault()

    let student_id = ev.dataTransfer.getData("text/plain")
    let seat_card = document.getElementById(ev.target.id)

    let student = student_list.find(s => s.id == student_id)
    if (!student) {
        console.error("Student not found: ", student_id)
        return
    }

    if (student.r > 0 && student.c > 0) {
        let old_seat_card = document.getElementById("seat-" + student.r + "-" + student.c)
        if (old_seat_card) {
            old_seat_card.innerHTML = ""
        } else {
            console.error("Old seat card not found: ", student.r, student.c)
        }
    }

    seat_card.setAttribute("data-student-id", student_id)
    seat_card.addEventListener("click", () => show_student_preferences(student_id))
    // TODO: Add event listener to show seat preferences
    seat_card.appendChild(seat_card_content(student_id))

    student.r = parseInt(seat_card.getAttribute("data-seat-row"))
    student.c = parseInt(seat_card.getAttribute("data-seat-col"))
    flush_student_cards()
}

/**
 * Returns the content of the seat card.
 * @param {Number} student_id the target student ID
 * @returns {HTMLElement} the content of the seat card
 */
function seat_card_content(student_id) {
    let title = document.createElement("h1")
    title.textContent = student_id
    title.classList.add("text-center", "center-text")
    return title
}