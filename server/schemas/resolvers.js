const { Query } = require('mongoose');
const { User, Book } = require('../models');
const { AuthenticationError, signToken } = require('../utils/auth');



const resolvers = {
    Query: {
        book: async () => {
            return Query.find({});
        },
        user: async (parent, { username }) => {
            return User.findOne({ username });
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate("jobs");
            }
            throw AuthenticationError;
          },
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError('Invalid credentials');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if(!correctPassword) {
                throw AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);
            return { token, user};
        }
    }, 
    addUser: async(parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);

        return { token, user};
    },

    saveBook: async(parent, args) => {
        try{
        const book = await Book.create(args);

        await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book._id } }
          );
  
          return book;
        } catch (error) {
          console.log("Error adding job!");
          console.log(error);
        }
        // throw AuthenticationError;
        // ('You need to be logged in!');

    },
    removeBook: async (parent, { bookId}) => {
        const book = await Book.findOneAndDelete(
            { bookId },
        );

        await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: book._id } }
          );

        return book;
    }
}