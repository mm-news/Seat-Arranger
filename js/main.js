// FIXME: Error occurs when the seat is dragged to the same seat.

// Setup

document.getElementById("set-room-size-btn").addEventListener("click", update_room)
document.getElementById("set-students-count-btn").addEventListener("click", () => {
    let current_count = student_list.length
    for (let i = 0; i < parseInt(document.getElementById("students-count").value); i++) {
        add_student(current_count + i + 1)
    }
})

// Pre-set control values
document.getElementById("room-row").setAttribute("value", 6)
document.getElementById("room-col").setAttribute("value", 5)
document.getElementById("students-count").setAttribute("value", 5)

// Pre-set 5 students
for (let i = 1; i <= 5; i++) {
    add_student(i)
}

/** @type {Array<Student>} */
var student_list = []

// Room

/**
 * Updates the room layout based on the event triggered.
 * @param {Event} event - The event object.
 */
function update_room(event) {
    //TODO: Only clear necessary seats
    console.log("Updating room layout")
    if (event) {
        if (!confirm("This is gonna clear all your seats, are you sure?")) {
            return
        }
    }

    student_list.forEach(s => {
        s.r = -1
        s.c = -1
    })

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
            c.setAttribute("onclick", `show_seat_preferences(${i}, ${j})`)
            c.setAttribute("ondragover", "seat_card_dragover_handler(event)") // Why not addEventListener?
            c.setAttribute("ondrop", "seat_card_drop_handler(event)") // Because it doesn't work :)
            r.appendChild(c)
        }
        new_arranging_area.appendChild(r)
    }

    document.getElementById("arranging-area").innerHTML = new_arranging_area.innerHTML
    flush_student_cards()
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
     * @param {String} display_name The name to display on the card.
     */
    constructor(id, r, c, avoid, avoid_plus, display_name) {
        this.id = id
        this.r = r
        this.c = c
        this.avoid = avoid
        this.avoid_plus = avoid_plus
        this.display_name = display_name
    }

    get card() {
        let card = document.createElement("div")
        card.classList.add("card", "vh-30", "student-card")
        card.setAttribute("data-student-id", this.id)
        card.setAttribute("id", "student-" + this.id)
        card.setAttribute("draggable", "true")
        card.addEventListener("click", () => show_student_preferences(this.id))
        card.addEventListener("dragstart", student_card_dragstart_handler)
        card.addEventListener("dragstart", () => show_unavailable_seats(this))
        card.addEventListener("dragend", hide_unavailable_seats)

        let card_body = document.createElement("div")
        card_body.classList.add("card-body")

        let card_title = document.createElement("h5")
        card_title.classList.add("card-title")
        card_title.textContent = this.display_name ? `${this.display_name} (#${this.id})` : "Student #" + this.id
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
        let info_box = document.getElementById("student-info")
        info_box.innerHTML = ""

        let cardbody = document.createElement("div")
        cardbody.classList.add("card-body")

        let set_display_name_area = document.createElement("div")
        set_display_name_area.classList.add("form-floating")

        let set_display_name_box = document.createElement("input")
        set_display_name_box.classList.add("form-control")
        set_display_name_box.setAttribute("type", "text")
        set_display_name_box.setAttribute("id", "set-display-name")
        set_display_name_box.setAttribute("placeholder", "Display Name")
        set_display_name_box.setAttribute("value", student.display_name ? student.display_name : id)
        set_display_name_box.addEventListener("change", () => {
            student.display_name = set_display_name_box.value
            show_student_preferences(id)
            flush_student_cards()
        })

        let set_display_name_label = document.createElement("label")
        set_display_name_label.setAttribute("for", "set-display-name")
        set_display_name_label.textContent = "display name"

        set_display_name_area.appendChild(set_display_name_box)
        set_display_name_area.appendChild(set_display_name_label)

        let update_when_changed = () => {
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
            console.info("Updated student: ", student)
            flush_student_cards()
        }

        let configure_avoid = generate_student_avoid_form(student, update_when_changed)

        cardbody.appendChild(set_display_name_area)
        cardbody.appendChild(configure_avoid)
        info_box.appendChild(cardbody)
    } else {
        console.error("Student not found: ", id)
    }
}

/**
 * Generate a form to set the avoid list for a student.
 * @param {Student} student_id the ID of the student to generate the form for
 * @param {Function} update_function the function to call when the form is updated
 */
function generate_student_avoid_form(student, update_function) {

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

        student_avoid_checkbox.addEventListener("change", update_function)

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

        student_avoid_plus_checkbox.addEventListener("change", update_function)

        if (student.avoid_plus.includes(s.id)) {
            student_avoid_plus_checkbox.setAttribute("checked", "")
        } // TODO: simplify this

        let th = document.createElement("th")
        th.setAttribute("scope", "row")
        th.textContent = s.display_name ? s.display_name : "#" + s.id

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

// Seat Info

function show_seat_preferences(r, c) {
    let seat_box = document.getElementById("seat-info")
    seat_box.innerHTML = ""

    let cardbody = document.createElement("div")
    cardbody.classList.add("card-body")

    let card_title = document.createElement("h5")
    card_title.classList.add("card-title")
    card_title.textContent = "Seat R" + r + "C" + c

    let set_disabled_area = document.createElement("div")
    set_disabled_area.classList.add("form-check", "form-switch")

    let set_disabled_checkbox = document.createElement("input")
    set_disabled_checkbox.classList.add("form-check-input")
    set_disabled_checkbox.setAttribute("type", "checkbox")
    set_disabled_checkbox.setAttribute("role", "switch")
    set_disabled_checkbox.setAttribute("id", "set-seat-disabled")
    let check = document.getElementById("seat-" + r + "-" + c).classList.contains("card-disabled") ? "true" : "false"
    set_disabled_checkbox.setAttribute("aria-checked", check)
    set_disabled_checkbox.addEventListener("change", () => set_disabled(r, c, set_disabled_checkbox.checked))

    let set_disabled_label = document.createElement("label")
    set_disabled_label.classList.add("form-check-label")
    set_disabled_label.setAttribute("for", "set-seat-disabled")
    set_disabled_label.textContent = "Seat Disabled"

    set_disabled_area.appendChild(set_disabled_checkbox)
    set_disabled_area.appendChild(set_disabled_label)

    cardbody.appendChild(card_title)
    cardbody.appendChild(set_disabled_area)

    seat_box.appendChild(cardbody)
}

/**
 * Set the seat to disabled or enabled
 * @param {Number} r the row number of the seat
 * @param {Number} c the column number of the seat
 * @param {Boolean} disabled whether the seat is disabled or not
 */
function set_disabled(r, c, disabled) {
    let seat_card = document.getElementById("seat-" + r + "-" + c)

    if (disabled) {
        seat_card.classList.add("bg-secondary", "card-disabled")
        seat_card.setAttribute("draggable", "false")
        if (seat_card.innerHTML) {
            if (seat_card.querySelector("h1").getAttribute("data-student-id")) {
                let student_id = seat_card.querySelector("h1").getAttribute("data-student-id")
                let student = student_list.find(s => s.id == student_id)
                student.r = -1
                student.c = -1
                flush_student_cards()
            }
            seat_card.innerHTML = ""
        }
    } else {
        seat_card.classList.remove("bg-secondary", "card-disabled")
        seat_card.removeAttribute("disabled")
        seat_card.setAttribute("draggable", "true")
    }
}

// Drag and Drop

/**
 * This is called when the drag event is triggered on the student card.
 * @param {Event} ev the drag event.
 */
function student_card_dragstart_handler(ev) {
    if (!ev.target.classList.contains("student-card")) {
        return
    } else if (ev.target.classList.contains("card-disabled")) {
        return
    }
    console.log("drag start: ", ev.target.getAttribute("data-student-id"))

    ev.dataTransfer.setData("text/plain", ev.target.getAttribute("data-student-id"))
    ev.dataTransfer.dropEffect = "link"
}

function seat_card_dragover_handler(ev) {
    if (ev.target.classList.contains("card-disabled")) {
        return
    }
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "link"
}

/**
 * Handles the drag event on the seat card.
 * @param {Event} ev the drag event.
 * @returns 
 */
function seat_card_dragstart_handler(ev) {
    if (!ev.target.classList.contains("seat-card")) {
        return
    } else if (ev.target.classList.contains("card-disabled")) {
        return
    }
    console.log("drag start: ", ev.target.getAttribute("data-student-id"))

    let student_id = document.getElementById(ev.target.id).querySelector("h1").getAttribute("data-student-id")

    ev.dataTransfer.setData("text/plain", student_id)
    ev.dataTransfer.setData("text/source", ev.target.id)
    ev.dataTransfer.dropEffect = "move"
}

/**
 * The is called when the drop event is triggered on the seat card.
 * @param {Event} ev the drop event
 */
function seat_card_drop_handler(ev) {
    if (ev.target.classList.contains("card-disabled")) {
        return
    }
    console.info("drop: ", ev.dataTransfer.getData("text/plain"))
    console.info("target: ", ev.target.id)
    ev.preventDefault()

    let student_id = ev.dataTransfer.getData("text/plain")

    let student = student_list.find(s => s.id == student_id)
    if (!student) {
        console.error("Student not found: ", student_id)
        return
    }

    if (student.r > 0 && student.c > 0) {
        let old_seat_card = document.getElementById("seat-" + student.r + "-" + student.c)
        if (old_seat_card) {
            old_seat_card.innerHTML = ""
            old_seat_card.setAttribute("data-student-id", "") // TODO: Remove the event listener
        } else {
            console.error("Old seat card not found: ", student.r, student.c)
        }
    }

    /** @type {HTMLElement} seat_card */
    let seat_card = ev.target.tagName == "DIV" ? ev.target : ev.target.parentElement

    let r = parseInt(seat_card.getAttribute("data-seat-row"))
    let c = parseInt(seat_card.getAttribute("data-seat-col"))

    if (student_list.some(s => s.r == r && s.c == c)) {
        student_list.filter(s => s.r == r && s.c == c).forEach(s => {
            s.r = -1
            s.c = -1
        })
        seat_card.innerHTML = ""
    }

    seat_card.setAttribute("data-student-id", student_id)
    seat_card.addEventListener("click", () => show_student_preferences(student_id))

    seat_card.appendChild(seat_card_content(student))
    seat_card.setAttribute("draggable", "true")
    seat_card.addEventListener("dragstart", seat_card_dragstart_handler)
    seat_card.addEventListener("dragstart", () => show_unavailable_seats(student))
    seat_card.addEventListener("dragend", hide_unavailable_seats)

    student.r = r
    student.c = c
    flush_student_cards()
    // TODO: Set replace / swap mode.
}

/**
 * Returns the content of the seat card.
 * @param {Student} student the target student ID
 * @returns {HTMLElement} the content of the seat card
 */
function seat_card_content(student) {
    let title = document.createElement("h1")
    title.textContent = student.display_name ? student.display_name : student.id
    title.classList.add("text-center", "center-text")
    title.setAttribute("data-student-id", student.id)

    let remove_button_span = document.createElement("sup")
    remove_button_span.classList.add("remove-button", "fs-6")
    remove_button_span.role = "button"
    remove_button_span.textContent = "[x]"
    remove_button_span.addEventListener("click", () => {
        document.getElementById(`seat-${student.r}-${student.c}`).innerHTML = "" // FIXME: The height goes wrong
        student.r = -1
        student.c = -1
        flush_student_cards()
    })

    title.appendChild(remove_button_span)

    return title
}

// Seat check
/**
 * Check the available seat for a student.
 * @param {Student} student the student to check the seat for
 */
function seat_check(student) {
    let avoid = student.avoid
    let avoid_plus = student.avoid_plus

    let max_rows = parseInt(document.getElementById("room-row").value)
    let max_cols = parseInt(document.getElementById("room-col").value)

    let unavailable_seats = []

    student_list.forEach(s => {
        if (s.id == student.id) {
            return
        }
        s.r > 0 && s.c > 0 ? unavailable_seats.push([s.r, s.c]) : null
    })

    avoid.forEach(id => {
        let s = student_list.find(s => s.id == id)
        if (s.r > 0 && s.c > 0) {
            let add_delta = (axis, delta, r, c) => {
                return axis == "x" ? [r, c + delta] : [r + delta, c]
            }

            ["x", "y"].forEach(axis => {
                [-1, 1].forEach(delta => {
                    let [r, c] = add_delta(axis, delta, s.r, s.c)
                    if (unavailable_seats
                        .some(function (s) { return array_eq(s, [r, c]) })
                        || r <= 0 || c <= 0
                        || r > max_rows || c > max_cols) {
                        return
                    }
                    unavailable_seats.push([r, c])
                })
            })
        }
    })

    avoid_plus.forEach(id => {
        let s = student_list.find(s => s.id == id)
        if (s.r > 0 && s.c > 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if ((i == 0 && j == 0) || (s.r + i) <= 0 || (s.c + j) <= 0 || (s.r + i) > max_rows || (s.c + j) > max_cols) {
                        continue
                    }
                    unavailable_seats.some(
                        function (arr) { return array_eq(arr, [s.r + i, s.c + j]) }
                    ) ? null : unavailable_seats.push([s.r + i, s.c + j])
                }
            }
        }
    })

    return unavailable_seats
}

function show_unavailable_seats(student) {
    hide_unavailable_seats()
    let unavailable_seats = seat_check(student)
    unavailable_seats.forEach(s => {
        let seat_card = document.getElementById(`seat-${s[0]}-${s[1]}`)
        seat_card.classList.add("bg-danger")
    })
}

function hide_unavailable_seats() {
    document.querySelectorAll(".bg-danger").forEach(e => e.classList.remove("bg-danger"))
}

function array_eq(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i])
}
