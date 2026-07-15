// In-memory data store for signed-up users
const signups = [];

export class SignupDao {
  // Helper to remove password from user object
  static sanitize(user) {
    if (!user) return null;
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Get all signups
  static getAll() {
    return signups.map(user => this.sanitize(user));
  }

  // Find a signup by ID (returns raw with password for internal operations if needed)
  static getByIdRaw(id) {
    return signups.find(user => user.id === id) || null;
  }

  // Get sanitized signup by ID
  static getById(id) {
    const user = this.getByIdRaw(id);
    return this.sanitize(user);
  }

  // Find a signup by email (case-insensitive)
  static getByEmail(email) {
    return signups.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Create a new signup
  static create(data) {
    const newSignup = {
      id: Math.random().toString(36).substring(2, 9), // Generates a simple unique 7-char ID
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password, // In a real app, hash this using bcrypt
      createdAt: new Date().toISOString()
    };
    signups.push(newSignup);
    return this.sanitize(newSignup);
  }

  // Update a signup
  static update(id, data) {
    const user = this.getByIdRaw(id);
    if (!user) return null;

    if (data.name !== undefined) user.name = data.name.trim();
    if (data.email !== undefined) user.email = data.email.trim();
    if (data.password !== undefined && data.password.length >= 6) {
      user.password = data.password;
    }

    return this.sanitize(user);
  }

  // Delete a signup
  static delete(id) {
    const index = signups.findIndex(user => user.id === id);
    if (index === -1) return false;
    signups.splice(index, 1);
    return true;
  }
}
