const addNote = document.getElementById("add");
const filterDateInput = document.getElementById("filter-date");
const filterButton = document.getElementById("filter-button");
const filterKeywordInput = document.getElementById("filter-keyword"); // קלט מילה
const filterKeywordButton = document.getElementById("filter-keyword-button"); // כפתור חיפוש מילה

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// טוען את הפתקים מה-localStorage אם קיימים
if (notes) {
    notes.forEach((note) => {
        addNewNote(note.title, note.text, note.date);
    });
}

// מאזין ללחיצה על כפתור הוספת פתק חדש
addNote.addEventListener("click", () => {
    addNewNote();
});

// מאזין ללחיצה על כפתור הסינון לפי תאריך
filterButton.addEventListener("click", () => {
    const selectedDate = new Date(filterDateInput.value).toDateString();
    filterNotesByDate(selectedDate);
});

// מאזין ללחיצה על כפתור הסינון לפי מילה
filterKeywordButton.addEventListener("click", () => {
    const keyword = filterKeywordInput.value.trim().toLowerCase();
    filterNotesByKeyword(keyword);
});

// פונקציה להוספת פתק חדש
function addNewNote(title = "", text = "", date = "") {
    const note = document.createElement("div");
    note.classList.add("note");

    const now = new Date();
    const datetime = date || now.toDateString();

    note.innerHTML = `
        <div class="tools">
            <button class="edit">edit</button>
            <button class="delete">delete</button>
        </div>
        <p class="datetime">${datetime}</p>
        <label for="title">TITLE:</label>
        <input type="text" class="taitel" placeholder="titel" value="${title || ""}">
        <label for="content">CONTEXT:</label>
        <textarea class="context" placeholder="context">${text || ""}</textarea>
    `;

    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");
    const titleInput = note.querySelector(".taitel");
    const textarea = note.querySelector(".context");

    titleInput.focus();
    editBtn.textContent = "save";

    deleteBtn.addEventListener("click", () => {
        note.remove();
        updateLocalStorage();
    });

    editBtn.addEventListener("click", () => {
        if (titleInput.hasAttribute("readonly") || textarea.hasAttribute("readonly")) {
            titleInput.removeAttribute("readonly");
            textarea.removeAttribute("readonly");
            editBtn.textContent = "save";
        } else {
            titleInput.setAttribute("readonly", true);
            textarea.setAttribute("readonly", true);
            editBtn.textContent = "edit";
            updateLocalStorage();
        }
    });

    titleInput.addEventListener("input", () => {
        updateLocalStorage();
    });

    textarea.addEventListener("input", () => {
        updateLocalStorage();
    });

    note.setAttribute("data-date", datetime);
    document.body.appendChild(note);

    updateLocalStorage();
}

// פונקציה לעדכון הפתקים ב-localStorage
function updateLocalStorage() {
    const notesData = [];
    const notesTitles = document.querySelectorAll(".note .taitel");
    const notesTexts = document.querySelectorAll(".note .context");
    const notesElements = document.querySelectorAll(".note");

    notesElements.forEach((note, index) => {
        notesData.push({
            title: notesTitles[index].value,
            text: notesTexts[index].value,
            date: note.getAttribute("data-date")
        });
    });

    localStorage.setItem("notes", JSON.stringify(notesData));
}

// פונקציה לסינון פתקים לפי תאריך
function filterNotesByDate(date) {
    const notesElements = document.querySelectorAll(".note");
    notesElements.forEach(note => {
        const noteDate = note.getAttribute("data-date");
        note.style.display = noteDate === date ? "block" : "none";
    });
}

// פונקציה לסינון פתקים לפי מילה
function filterNotesByKeyword(keyword) {
    const notesElements = document.querySelectorAll(".note");
    notesElements.forEach(note => {
        const title = note.querySelector(".taitel").value.toLowerCase();
        const content = note.querySelector(".context").value.toLowerCase();

        if (title.includes(keyword) || content.includes(keyword)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    });
}
