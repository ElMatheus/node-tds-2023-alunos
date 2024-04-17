import pg from "../../database/index.js"
export default class UsersRepository {
  constructor() {
    this.pg = pg;
  }

  async getUsers() {
    try {
      const allUsers = await this.pg.manyOrNone("SELECT * FROM users");
      console.log(allUsers);
      return allUsers;
    } catch (error) {
      console.error("Failed to get all users", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.pg.oneOrNone("SELECT * FROM users WHERE id = $1", id);
      console.log(user);
      return user;
    } catch (error) {
      console.error(`Failed to get user by id ${id}`, error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.pg.oneOrNone("SELECT * FROM users WHERE email = $1", email);
      return user;
    } catch (error) {
      console.error("Failed to get user by email", error);
      throw error;
    }
  }

  async createUser(user) {
    try {
      await this.pg.none("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)", [
        user.id,
        user.name,
        user.email,
        user.password
      ]);
      return user;
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  }

  async updateUser(id, name, email, password) {
    try {
      const user = await this.getUserById(id);

    if (!user) {
      return null;
    }

    const updateUser = await this.pg.oneOrNone(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [name, email, password, id]
    );

    return updateUser;
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await this.pg.none("DELETE FROM users WHERE id = $1", id);
    } catch (error) {
      console.error("Failed to delete user", error);
      throw error;
    }
  }
}
