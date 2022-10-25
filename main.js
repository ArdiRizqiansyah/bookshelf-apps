const books = [];
const STORAGE_KEY = 'books';
const RENDER_EVENT = 'render-book';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateId() {
	return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, baca) {
    return {
        id,
        judul,
        penulis,
        tahun,
        baca,
    }
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }

    return -1;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (todos[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject){
    const {id, judul, penulis, tahun, baca} = bookObject;

    const complateBookList = document.querySelector("#completeBookshelfList");
    const incomplateBookList = document.querySelector("#incompleteBookshelfList");

        
    let article = document.createElement('article');

    article.classList.add('book_item');
    article.setAttribute('id', id);

    article.innerHTML = `<h3>${judul}</h3>`;
    article.innerHTML += `<p>Penulis: ${penulis}</p>`;
    article.innerHTML += `<p>Tahun: ${tahun}</p>`;
    article.innerHTML += `
                            <div class="action">

                                <button class="blue" onclick="showModalEdit(${id})">Edit</button>

                                <button class="green" id="${id}" onclick=updateStatusBook(${id})> ${
                                    baca == true
                                    ? "Selesai dibaca"
                                    : "Belum selesai di Baca"
                                } </button>

                                <button class="red" onclick="confirmDeleteBook(${id})">Hapus buku</button>

                            </div>
                        `;

    // cek apakah buku sudah dibaca atau belum jika sudah taruh di complate dan jika belum taruh diincomplete
    if(baca == true){
        complateBookList.appendChild(article);
    }else{
        incomplateBookList.appendChild(article);
    }
}

function addBook(){
    const judul = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const tahun = document.getElementById("inputBookYear").value;
    const baca = document.getElementById("inputBookIsComplete").checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, judul, penulis, tahun, baca);
    books.push(bookObject);

    saveData();

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData(){
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function updateStatusBook(bookId){
    let bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    let statusUpdate = bookTarget.baca == true ? false : true;
    bookTarget.baca = statusUpdate;

    saveData();
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBooks(bookId){
    let bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    books.splice(bookTarget, 1);

    saveData();

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function confirmDeleteBook(bookId){
    if(confirm('Apakah Anda yakin ingin menghapus data?')){
        removeBooks(bookId);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
    const complateBookList = document.querySelector("#completeBookshelfList");
    const incomplateBookList = document.querySelector("#incompleteBookshelfList");

    complateBookList.innerHTML = '';
    incomplateBookList.innerHTML = '';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);

        if(bookElement != undefined){
            if (bookItem.baca) {
              complateBookList.appendChild(bookElement);
            } else {
              incomplateBookList.appendChild(bookElement);
            }
        }
    }
});

document.getElementById('searchSubmit').addEventListener("click", function (event){
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    
    const bookList = document.querySelectorAll('.book_item > h3');

    for (buku of bookList) {
        if (searchBook == '') {
            buku.parentElement.style.display = "block";
        }else if(searchBook !== buku.innerText.toLowerCase()){
            buku.parentElement.style.display = "none";
        }else{
            buku.parentElement.style.display = "block";
        }
    }
});

// update book
function showEditBook(bookId){
    let bookEdit = findBook(bookId);

    if (bookEdit == null) return;

    document.getElementById("editBookTitle").value = bookEdit.judul;
    document.getElementById("editBookAuthor").value = bookEdit.penulis;
    document.getElementById("editBookYear").value = bookEdit.tahun;
    document.getElementById("editBookIsComplate").checked = bookEdit.baca;

    const updateForm = document.getElementById("editBook");

    updateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if(event.handled !== true){
            event.handled = true;
            updateBook(bookId);
        }

    });
}

function updateBook(bookId){

    let bookUpdate = findBook(bookId);

    const judul = document.getElementById("editBookTitle").value;
    const penulis = document.getElementById("editBookAuthor").value;
    const tahun = document.getElementById("editBookYear").value;
    const baca = document.getElementById("editBookIsComplate").checked;

    bookUpdate.judul = judul;
    bookUpdate.penulis = penulis;
    bookUpdate.tahun = tahun;
    bookUpdate.baca = baca;

    modal.style.display = "none";

    alert("Buku berhasil di update");

    saveData();

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// modal
let modal = document.getElementById("modal");

function showModalEdit(bookId){
    showEditBook(bookId);

    modal.style.display = "block";
}

function closeModal(){
    modal.style.display = "none";
}