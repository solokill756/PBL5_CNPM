module.exports = {
    extends: [
      'react-app',
      'react-app/jest'
    ],
    rules: {
      // Chuyển các lỗi React Hooks thành warning
      'react-hooks/exhaustive-deps': 'warn',
      
      // Chuyển các lỗi unused variables thành warning
      'no-unused-vars': 'warn',
      
      // Chuyển unreachable code thành warning
      'no-unreachable': 'warn',
      
      // Chuyển no-loop-func thành warning
      'no-loop-func': 'warn'
    }
  };