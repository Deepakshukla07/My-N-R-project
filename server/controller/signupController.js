import { SignupModel } from '../model/signupModel.js';
import { SignupDao } from '../dao/signupDao.js';

export class SignupController {
  // GET /api/signup
  static getAllSignups(req, res) {
    try {
      const signups = SignupDao.getAll();
      return res.status(200).json(signups);
    } catch (error) {
      console.error('Error fetching signups:', error);
      return res.status(500).json({ error: 'Failed to fetch signups.' });
    }
  }

  // GET /api/signup/:id
  static getSignupById(req, res) {
    try {
      const { id } = req.params;
      const signup = SignupDao.getById(id);
      if (!signup) {
        return res.status(404).json({ error: 'User signup not found.' });
      }
      return res.status(200).json(signup);
    } catch (error) {
      console.error('Error fetching signup by id:', error);
      return res.status(500).json({ error: 'Failed to fetch signup.' });
    }
  }

  // POST /api/signup
  static createSignup(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validate the input data
      const validation = SignupModel.validate({ name, email, password, confirmPassword });
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      // Check if email already exists
      const existingUser = SignupDao.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          errors: { email: 'Email is already registered.' }
        });
      }

      // Create the user
      const newSignup = SignupDao.create({ name, email, password });
      return res.status(201).json({
        message: 'Signup successful!',
        user: newSignup
      });
    } catch (error) {
      console.error('Error creating signup:', error);
      return res.status(500).json({ error: 'Failed to process signup.' });
    }
  }

  // PUT /api/signup/:id
  static updateSignup(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = SignupDao.getByIdRaw(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Validate modified fields (only validates fields that are passed in req.body)
      const validationData = {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
        password: password !== undefined ? password : existingUser.password
      };

      const validation = SignupModel.validate(validationData);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      // If email is changing, check if new email is already registered by another user
      if (email !== undefined && email.toLowerCase() !== existingUser.email.toLowerCase()) {
        const emailCheck = SignupDao.getByEmail(email);
        if (emailCheck) {
          return res.status(400).json({
            errors: { email: 'Email is already taken by another user.' }
          });
        }
      }

      // Update user
      const updatedUser = SignupDao.update(id, { name, email, password });
      return res.status(200).json({
        message: 'User updated successfully!',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating signup:', error);
      return res.status(500).json({ error: 'Failed to update signup.' });
    }
  }

  // DELETE /api/signup/:id
  static deleteSignup(req, res) {
    try {
      const { id } = req.params;
      const deleted = SignupDao.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error deleting signup:', error);
      return res.status(500).json({ error: 'Failed to delete signup.' });
    }
  }
}
