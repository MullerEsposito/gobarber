import { Router } from 'express';
import AutheticationUserService from '@modules/users/services/AuthenticationUserService';
import UsersRepository from '../../typeorm/entities/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();

    try {
        const { email, password } = request.body;

        const authenticateUser = new AutheticationUserService(usersRepository);

        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        delete user.password;

        return response.status(200).json({ user, token });
    } catch (err) {
        return response.status(err.statusCode).json({ error: err.message });
    }
});

export default sessionsRouter;
