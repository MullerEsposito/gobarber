import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errs/AppError';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';
import IUsersRespository from '../infra/repositories/IUsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRespository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('E-mail address already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
