const localStorageKey = "BOOK_DATA"

const title = document.querySelector("#inputBookTitle")
const author = document.querySelector("#inputBookAuthor")
const category = document.querySelector("#inputBookCategory")
const year = document.querySelector("#inputBookYear")
const isComplete = document.querySelector("#inputBookIsComplete")

const errorTitle = document.querySelector("#errorTitle")
const errorAuthor = document.querySelector("#errorAuthor")
const errorCategory = document.querySelector("#errorCategory")
const errorYear = document.querySelector("#errorYear")

const sectionTitle = document.querySelector("#sectionTitle")
const sectionAuthor = document.querySelector("#sectionAuthor")
const sectionCategory = document.querySelector("#sectionCategory")
const sectionYear = document.querySelector("#sectionYear")

const submitBook = document.querySelector("#submitBook")
const searchBook = document.getElementById("searchBook");


let validateForm = []
let validateTitle = null
let validateAuthor = null
let validateCategory = null
let validateYear = null

window.addEventListener("load", function () {
    if (localStorage.getItem(localStorageKey) !== null) {
        const booksData = getBook()
        showBook(booksData)
    }
})

submitBook.addEventListener("click", function () {
    if (submitBook.value == "") {
        validateForm = []

        title.classList.remove("error")
        author.classList.remove("error")
        category.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display")
        errorAuthor.classList.add("error-display")
        errorCategory.classList.add("error-display")
        errorYear.classList.add("error-display")

        if (title.value == "") {
            validateTitle = false
        } else {
            validateTitle = true
        }

        if (author.value == "") {
            validateAuthor = false
        } else {
            validateAuthor = true
        }

        if (category.value == "") {
            validateCategory = false
        } else {
            validateCategory = true
        }

        if (year.value == "") {
            validateYear = false
        } else {
            validateYear = true
        }

        validateForm.push(validateTitle, validateAuthor, validateCategory, validateYear)
        let resultValidate = validate(validateForm)

        if (resultValidate.includes(false)) {
            return false
        } else {
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                category: category.value.trim(),
                year: parseInt(year.value, 10),
                isComplete: isComplete.checked
            }
            createBook(newBook)

            title.value = ''
            author.value = ''
            category.value = ''
            year.value = ''
            isComplete.checked = false
        }
    } else {
        const bookData = getBook().filter(a => a.id != submitBook.value);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        const newBook = {
            id: submitBook.value,
            title: title.value.trim(),
            author: author.value.trim(),
            category: category.value.trim(),
            year: parseInt(year.value, 10),
            isComplete: isComplete.checked
        }
        createBook(newBook)
        submitBook.innerHTML = "Masukkan Buku"
        submitBook.value = ''
        title.value = ''
        author.value = ''
        category.value = ''
        year.value = ''
        isComplete.checked = false
    }
})

function validate(check) {
    let resultValidate = []

    check.forEach((a, i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultValidate.push(false)
            } else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultValidate.push(false)
            } else if (i == 2) {
                category.classList.add("error")
                errorCategory.classList.remove("error-display")
                resultValidate.push(false)
            } else {
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultValidate.push(false)
            }
        }
    });

    return resultValidate
}

function createBook(book) {
    let bookData = []

    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    } else {
        bookData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookData.unshift(book)
    localStorage.setItem(localStorageKey, JSON.stringify(bookData))

    showBook(getBook())
}

function getBook() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}

function completedBook(id) {
    let confirmation = confirm("Apakah kamu yakin ingin memindahkan buku ke selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getBook().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            category: bookDataDetail[0].category,
            year: bookDataDetail[0].year,
            isComplete: true
        }

        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        createBook(newBook)
    } else {
        return 0
    }
}

function uncompletedBook(id) {
    let confirmation = confirm("Apakah kamu yakin ingin memindahkan buku ke belum dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getBook().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            category: bookDataDetail[0].category,
            year: bookDataDetail[0].year,
            isComplete: false
        }

        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))

        createBook(newBook)
    } else {
        return 0
    }
}

function showBook(books = []) {
    const uncompleted = document.querySelector("#uncompletedBookList")
    const completed = document.querySelector("#completedBookList")

    uncompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isComplete == false) {
            let listBook = `
            <article class="list-book">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Kategori: ${book.category}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <button class="btn btn-primary" onclick="completedBook('${book.id}')"><ion-icon name="arrow-forward-outline"></ion-icon></button>
                    <button class="btn btn-success ml" onclick="editBook('${book.id}')"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn btn-danger ml" onclick="deleteBook('${book.id}')"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </article>
            <hr> 
            `

            uncompleted.innerHTML += listBook
        } else {
            let listBook = `
            <article class="list-book">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Kategori: ${book.category}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="btn btn-primary" onclick="uncompletedBook('${book.id}')"><ion-icon name="arrow-back-outline"></ion-icon></button>
                    <button class="btn btn-success ml" onclick="editBook('${book.id}')"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn btn-danger ml" onclick="deleteBook('${book.id}')"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </article>
            <hr> 
            `
            completed.innerHTML += listBook
        }
    });
}

function editBook(id) {
    const bookDataDetail = getBook().filter(a => a.id == id);
    title.value = bookDataDetail[0].title
    author.value = bookDataDetail[0].author
    category.value = bookDataDetail[0].category
    year.value = bookDataDetail[0].year
    bookDataDetail[0].isComplete ? isComplete.checked = true : isComplete.checked = false

    submitBook.innerHTML = "Simpan buku"
    submitBook.value = bookDataDetail[0].id
}

function deleteBook(id) {
    let confirmation = confirm("Apakah kamu yakin ingin menghapus buku?")

    if (confirmation == true) {
        const bookDataDetail = getBook().filter(a => a.id == id);
        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey, JSON.stringify(bookData))
        showBook(getBook())
    } else {
        return 0
    }
}

function SearchBookList(title) {
    const bookData = getBook();
    if (bookData.length === 0) {
        return;
    }

    const bookList = [];

    for (let index = 0; index < bookData.length; index++) {
        const tempTitle = bookData[index].title.toLowerCase();
        const tempTitleTarget = title.toLowerCase();
        if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
            bookList.push(bookData[index]);
        }
    }
    return bookList;
}

searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const bookData = getBook();
    if (bookData.length === 0) {
        return;
    }

    const title = document.getElementById("searchBookTitle").value;
    if (title === null) {
        showBook(bookData);
        return;
    }
    const bookList = SearchBookList(title);
    showBook(bookList);
});

function filterNonNumeric(input) {
    input.value = input.value.replace(/\D/g, '');

    var currentYear = new Date().getFullYear();
    if (parseInt(input.value) > currentYear) {
        input.value = currentYear;
    }
}

