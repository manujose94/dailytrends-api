import bcrypt from 'bcrypt';
import { IEncryptor } from '../ports/security/encryptor-interface';

export class Encryptor implements IEncryptor {
    async hash(input: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(input, saltRounds);
    }

    async compare(input: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(input, hash);
    }

}