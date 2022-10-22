const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  }
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
  response.code(500)
  return response
}

const getAllBookshandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (name) {
    const findBookByName = books
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))
    const response = h.response({
      status: 'success',
      data: {
        books: findBookByName,
      },
    })
    response.code(200)
    return response
  }

  if (reading) {
    if (reading === '1') {
      const readingBook = books
        .filter((book) => book.reading === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }))
      const response = h.response({
        status: 'success',
        data: {
          books: readingBook,
        },
      })
      response.code(200)
      return response
    }
    const unreadingBook = books
      .filter((book) => book.reading === false)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))
    const response = h.response({
      status: 'success',
      data: {
        books: unreadingBook,
      },
    })
    response.code(200)
    return response
  }

  if (finished) {
    if (finished === '1') {
      const finishedBook = books
        .filter((book) => book.finished === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }))
      const response = h.response({
        status: 'success',
        data: {
          books: finishedBook,
        },
      })
      response.code(200)
      return response
    }
    const unfinishedBook = books
      .filter((book) => book.finished === false)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))
    const response = h.response({
      status: 'success',
      data: {
        books: unfinishedBook,
      },
    })
    response.code(200)
    return response
  }

  const allBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }))

  const response = h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((b) => b.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBookshandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
