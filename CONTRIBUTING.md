# Contributing to Alibai 🤝

Thank you for your interest in contributing to Alibai! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### **Types of Contributions**

We welcome various types of contributions:

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new features or improvements
- 📝 **Documentation** - Improve docs, add examples, fix typos
- 🔧 **Code Contributions** - Submit pull requests with new features or fixes
- 🎨 **UI/UX Improvements** - Enhance the user interface and experience
- 🧪 **Testing** - Add tests or improve test coverage
- 🌍 **Translations** - Help translate the app to other languages

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB (for local development)

### **Setup Development Environment**

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Alibai-Excuse-Generator.git
   cd Alibai-Excuse-Generator
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend .env
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend .env
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Backend (in backend directory)
   npm start
   
   # Frontend (in frontend directory)
   npm run dev
   ```

## 📝 Development Guidelines

### **Code Style**

- **JavaScript/Node.js**: Follow ESLint configuration
- **React**: Use functional components with hooks
- **CSS**: Use Tailwind CSS classes, avoid custom CSS when possible
- **Comments**: Write clear, descriptive comments for complex logic
- **Naming**: Use descriptive variable and function names

### **Commit Message Format**

Use conventional commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add OAuth login support
fix(api): resolve CORS issue in production
docs(readme): update installation instructions
```

### **Pull Request Process**

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

### **Pull Request Template**

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests pass
- [ ] Tested manually in browser
- [ ] Tested with different screen sizes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, especially in hard-to-understand areas
- [ ] Documentation is updated
- [ ] No console.log statements left in code
- [ ] No sensitive information exposed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

## 🐛 Reporting Bugs

### **Before Submitting a Bug Report**

1. **Check existing issues** - Search for similar issues
2. **Reproduce the bug** - Make sure you can consistently reproduce it
3. **Check environment** - Verify it's not a local environment issue

### **Bug Report Template**

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js version: [e.g. 16.13.0]
- npm version: [e.g. 8.1.0]

## Additional Context
Any other context, screenshots, or logs.
```

## 💡 Suggesting Features

### **Feature Request Template**

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like to see this implemented?

## Alternative Solutions
Any alternative solutions you've considered.

## Additional Context
Any other context, mockups, or examples.
```

## 🧪 Testing

### **Running Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### **Writing Tests**

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

## 📚 Documentation

### **Documentation Guidelines**

- Keep documentation up-to-date
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update README.md for major changes

## 🏷️ Labels and Milestones

### **Issue Labels**

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issues
- `priority: low`: Low priority issues

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **GitHub Contributors** - Automatic recognition
- **Release Notes** - Mentioned in relevant releases

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: Contact through GitHub profile

## 📄 License

By contributing to Alibai, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Alibai!** 🚀

Your contributions help make Alibai better for everyone. 