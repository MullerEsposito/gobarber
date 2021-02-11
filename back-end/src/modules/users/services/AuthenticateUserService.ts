import { sign } from 'jsonwebtoken';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errs/AppError';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';
import IUsersRespository from '../infra/repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AutheticationUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRespository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect e-mail/password combination', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError('Incorrect e-mail/password combination', 401);
        }

        const { secret, expiresIn } = authConfig.jws;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AutheticationUserService;
