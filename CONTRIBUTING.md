# Contributing to Portivo

Thank you for your interest in contributing to Portivo! This document provides guidelines for contributing to the project.

## Code Style

We maintain consistent code style using ESLint and Prettier.

### Before Committing

1. **Run Linter:**
   ```bash
   npm run lint:fix
   ```

2. **Format Code:**
   ```bash
   npm run format
   ```

3. **Test Your Changes:**
   - Test the specific feature you modified
   - Ensure no existing features are broken
   - Check console for warnings/errors

## Commit Message Guidelines

Follow conventional commits format:

```
type(scope): subject

body

footer
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, semicolons)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/changes
- `chore:` Dependency updates, build changes
- `ci:` CI/CD configuration changes

### Examples

```
feat(auth): add refresh token mechanism

Implement automatic token refresh for better session management
- Add refresh token generation
- Add token refresh endpoint
- Update auth middleware

Fixes #123
```

```
fix(profile): resolve image upload validation

Fixed issue where images larger than 1MB were not rejected properly

Closes #456
```

## Branch Naming

Create branches from main with descriptive names:

```
feature/add-email-notifications
fix/subdomain-validation-issue
docs/update-setup-guide
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run linter and formatter
4. Commit with clear messages
5. Push to your fork
6. Create PR with descriptive title and description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Breaking change

## Changes Made
- List specific changes
- With details if needed

## Testing
- [ ] I tested this locally
- [ ] No existing features broken
- [ ] Tested on: (browser/OS)

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #123
Relates to #456
```

## Code Quality Standards

### Backend (Node.js/Express)

- Use async/await for asynchronous code
- Always use try/catch for error handling
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

Example:
```javascript
/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} User data with JWT token
 * @throws {Error} If authentication fails
 */
async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      throw new Error('Invalid password');
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    return { user, token };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
```

### Frontend (React)

- Use functional components with hooks
- Keep components small and reusable
- Use meaningful prop names
- Add PropTypes or TypeScript for type checking
- Use custom hooks for shared logic
- Keep state close to where it's used

Example:
```javascript
import React, { useState } from 'react';

/**
 * Profile form component for editing user profile
 * @param {object} initialData - Initial form data
 * @param {function} onSubmit - Callback on form submission
 */
function ProfileForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Testing

When adding features or fixing bugs, please add tests:

```bash
npm run test
```

### Test File Naming
- Backend: `filename.test.js`
- Frontend: `filename.test.jsx`

## Documentation

- Update README if changing features
- Document new environment variables
- Add API documentation for new endpoints
- Include inline code comments for complex logic

## Performance

- Minimize bundle size
- Optimize database queries (add indexes)
- Use proper caching
- Lazy load components
- Avoid unnecessary re-renders

## Security

- Never commit `.env` files with secrets
- Always validate and sanitize user input
- Use parameterized queries for database
- Implement rate limiting
- Use HTTPS in production
- Add security headers

## Questions?

Feel free to:
1. Check existing issues and discussions
2. Create a discussion for major questions
3. Ask in pull request comments

---

Thank you for contributing! 🚀
