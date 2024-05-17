/**
 * @swagger
 * components:
 *   schemas:
 *     UserEntity:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address, used for registration and login
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password, used for registration and login
 *           example: "securePassword123"
 *       required:
 *         - email
 *         - password
 */
export class UserEntity {
  public email: string;
  public password: string;

  constructor(userInput: UserEntity) {
    this.email = userInput.email;
    this.password = userInput.password;
  }
}
