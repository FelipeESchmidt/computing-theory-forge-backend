import { decryptPassword, encryptPassword } from '../crypto';

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

  describe('decryptPassword', () => {
    it('should decrypt password', () => {
      // Arrange
      const password = 'password';
      const encryptedPassword = encryptPassword(password);
      // Act
      const decryptedPassword = decryptPassword(encryptedPassword);
      // Assert
      expect(decryptedPassword).toEqual(password);
    });
  });
});
