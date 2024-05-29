import { encryptPassword } from '../crypto';

describe('crypto', () => {
  describe('encryptPassword', () => {
    it('should encrypt password', () => {
      // Arrange
      const password = 'password';
      // Act
      const encryptedPassword = encryptPassword(password);
      // Assert
      expect(encryptedPassword).not.toEqual(password);
    });
  });
});
