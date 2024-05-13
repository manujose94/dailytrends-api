export class UserEntity {
    public email: string
    public password: string

    constructor(userInput: UserEntity) {
        this.email = userInput.email
        this.password = userInput.password
    }
}