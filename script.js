let titles = [];
let notes = [];
load();

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function render() {
    let myNotes = document.getElementById('myNotes');
    myNotes.innerHTML = ``;
    if (titles.length && notes.length > 0) {
        for (let i = 0; i < titles.length && notes.length; i++) {
            let title = titles[i];
            let note = notes[i];

            note = note.replace(/\n/g, '<br>');

            document.getElementById('bulb').innerHTML = ``;
            myNotes.innerHTML += `<div class="inputResult">
                ${title}:<br>
                <br>
                ${note}
                <div class="deleteContainer">
                <img class="garbageImage" src="./img/garbage.png" alt="Mülleimer" onclick="deleteNote(${i})">
                </div>
            </div>`;
        }
    } else {
        document.getElementById('bulb').innerHTML = `
        <div class="myNotesStyle" id="bulb">
        <img class="bulbImage" src="./img/bulb.png" alt="Glühbirne">
        <h2>Hier werden hinzugefügte Notizen angezeigt</h2>
        </div>
        `;
    }
}

function maximise() {
    const maximiseInput = document.getElementById('maximiseInput');
    maximiseInput.innerHTML = `
        <form id="myForm">
            <input type="text" placeholder="Titel" class="inputField" id="titleInput">
            <textarea rows="4" cols="50" placeholder="Notiz eingeben ..." class="inputField" id="noteInput"></textarea>
            <button type="button" onclick="validateAndSubmit()">Absenden</button>
        </form>
    `;
}

function validateAndSubmit() {
    const titleInput = document.getElementById('titleInput');
    const noteInput = document.getElementById('noteInput');
    if (titleInput.value.trim() === '' || noteInput.value.trim() === '') {
        alert('Bitte füllen Sie alle Felder aus.');
    } else {
        addNote(titles, notes);
    }
}

function addNote(titles, notes) {
    let titleInput = document.getElementById('titleInput');
    let noteInput = document.getElementById('noteInput');

    titles.push(titleInput.value);
    notes.push(noteInput.value);

    titleInput.value = ``;
    noteInput.value = ``;

    save();
    render();
}

function deleteNote(i) {
    let deletedNote = {
        title: titles[i],
        note: notes[i]
    };

    let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];
    deletedNotes.push(deletedNote);
    localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

    titles.splice(i, 1);
    notes.splice(i, 1);
    save();
    render();

    if (titles.length === 0 && notes.length === 0) {
        document.getElementById('bulb').innerHTML = `
        <div class="myNotesStyle" id="bulb">
        <img class="bulbImage" src="./img/bulb.png" alt="Glühbirne">
        <h2>Hier werden hinzugefügte Notizen angezeigt</h2>
        </div>
        `;
    }
}

function save() {
    let titlesAsText = JSON.stringify(titles);
    let notesAsText = JSON.stringify(notes);
    localStorage.setItem('titles', titlesAsText);
    localStorage.setItem('notes', notesAsText);
}

function load() {
    let titlesAsText = localStorage.getItem('titles');
    let notesAsText = localStorage.getItem('notes');
    if (titlesAsText && notesAsText) {
        titles = JSON.parse(titlesAsText);
        notes = JSON.parse(notesAsText);
    }
}

function loadExternalContent() {
    showDeletedNotes();
}

function showDeletedNotes() {
    let deletedNotesContainer = document.getElementById('deletedNotes');
    deletedNotesContainer.innerHTML = ``;
    
    let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];
    
    for (let i = 0; i < deletedNotes.length; i++) {
        let deletedNote = deletedNotes[i];
      
        let deletedNoteElement = document.createElement('div');

        deletedNote.note = deletedNote.note.replace(/\n/g, '<br>');

        deletedNoteElement.innerHTML = `
            <div class="inputResult">${deletedNote.title}:
            <br>
            <br>
            ${deletedNote.note}
            <div class="restoreAndDelete"><button onclick="notesRestore(${i})">Wiederherstellen</button>
            <img class="garbageImage" src="./img/garbage.png" alt="Mülleimer" onclick="deletePermanently(${i})"></div>
            </div>
        `;

        deletedNotesContainer.appendChild(deletedNoteElement);
    }
}

function notesRestore(index) {
    let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];
    
    if (index >= 0 && index < deletedNotes.length) {
        let restoredNote = deletedNotes[index];
        
        titles.push(restoredNote.title);
        notes.push(restoredNote.note);
        
        deletedNotes.splice(index, 1);
        
        localStorage.setItem('titles', JSON.stringify(titles));
        localStorage.setItem('notes', JSON.stringify(notes));
        localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));
        
        showDeletedNotes();
        render();

        let deletedNotesContainer = document.getElementById('deletedNotes');

        if (deletedNoteElement) {
            deletedNotesContainer.removeChild(deletedNoteElement);
        }
        }  
}

function deletePermanently(index) {
    let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];

    if (index >= 0 && index < deletedNotes.length) {
        deletedNotes.splice(index, 1);

        localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

        showDeletedNotes();
    }
}