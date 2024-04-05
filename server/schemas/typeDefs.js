const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    password: String
    bookCount: Int
    }

    type Book {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
        book: [Book]
    }

    type Mutation {
            login(email: String, password: String): Auth
            addUser(username: String, email: String, password: String): Auth
            saveBook(authors: [String], description: String, title: String, bookId: ID, image: String, link: String): User
            removeBook(bookId: ID): User
    }

`;


module.exports = typeDefs;
