import UsersRepositoryFake from '@modules/users/infra/repositories/fakes/UsersRepositoryFake';
import AppError from '@shared/errs/AppError';
import HashProviderFake from '../providers/hashProvider/fake/HashProviderFake';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeHashProvider = new HashProviderFake();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Müller',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        const userAuthenticated = await authenticateUser.execute({
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        expect(userAuthenticated).toHaveProperty('token');
    });

    it('should not be able to authenticate with user incorrect', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeHashProvider = new HashProviderFake();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Müller',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        expect(
            authenticateUser.execute({
                email: 'mullersposito@hotmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with password incorrect', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeHashProvider = new HashProviderFake();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Müller',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        expect(
            authenticateUser.execute({
                email: 'mulleresposito@hotmail.com',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
