import UsersRepositoryFake from '@modules/users/infra/repositories/fakes/UsersRepositoryFake';
import AppError from '@shared/errs/AppError';
import HashProviderFake from '../providers/hashProvider/fake/HashProviderFake';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeHashProvider = new HashProviderFake();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const createdUser = await createUser.execute({
            name: 'Müller',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        expect(createdUser).toHaveProperty('id');
        expect(createdUser.email).toBe('mulleresposito@hotmail.com');
    });

    it('should not be able to create two users with same address e-mail', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeHashProvider = new HashProviderFake();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Müller',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'Müller',
                email: 'mulleresposito@hotmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
