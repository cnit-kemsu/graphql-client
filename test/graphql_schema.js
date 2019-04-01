const {
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString }
  })
});

const UserCreateInputType = new GraphQLInputObjectType({
  name: 'UserCreateInput',
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString }
  })
});

const UserUpdateInputType = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: () => ({
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const users = {
  type: new GraphQLList(UserType),
  args: {
    limit: { type: GraphQLInt }
  },
  resolve: async (obj, { limit }, { db }) => {
    const result = await db.all(`SELECT id, username, email FROM users LIMIT ?`, limit || -1);
    return result;
  }
};

const createUser = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserCreateInputType) }
  },
  async resolve(obj, { input: { username, email } }, { db }) {
    const { lastID: id } = await db.run(`INSERT INTO users (username, email) VALUES(?,?)`, username, email);
    return {
      id,
      username,
      email
    };
  }
};

const updateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    input: { type: new GraphQLNonNull(UserUpdateInputType) }
  },
  async resolve(obj, { id, input: { username, email } }, { db }) {
    await db.run(`UPDATE users SET username = ?, email = ? WHERE id = ?`, username, email, id);
    const result = await db.all(`SELECT id, username, email FROM users WHERE id = $id`, id);
    return result[0];
  }
};

const deleteUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(obj, { id }, { db }) {
    const result = await db.all(`SELECT id, username, email FROM users WHERE id = $id`, id);
    await db.run(`DELETE FROM users WHERE id = ?`, id);
    return result[0];
  }
};

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser,
      updateUser,
      deleteUser
    }
  })
});