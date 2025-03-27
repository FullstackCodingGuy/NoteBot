const MarkdownIt = require("markdown-it");
const Dexie = require("dexie");

const md = new MarkdownIt();
const db = new Dexie("NotesDB");
db.version(1).stores({
    notes: "++id, title, content"
});

document.getElementById("save-note").addEventListener("click", async () => {
    let title = document.getElementById("note-title").value;
    let content = document.getElementById("note-content").value;
    
    await db.notes.add({ title, content });
    document.getElementById("markdown-preview").innerHTML = md.render(content);
});

document.getElementById("image-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById("markdown-preview").innerHTML += `<img src="${reader.result}" width="300px">`;
        };
        reader.readAsDataURL(file);
    }
});
