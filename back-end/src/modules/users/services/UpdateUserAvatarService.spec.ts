import StorageProviderFake from '@shared/container/providers/storageProvider/fakes/StorageProviderFake';
import AppError from '@shared/errs/AppError';
import UsersRepositoryFake from '../infra/repositories/fakes/UsersRepositoryFake';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update the avatar of user.', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeStorageProvider = new StorageProviderFake();
        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: 'Müller Esposito',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        const userAvatarUpdated = await updateAvatar.execute({
            user_id: user.id,
            avatarFilename: 'name-avatar.jpg',
        });

        expect(userAvatarUpdated.avatar).toEqual('name-avatar.jpg');
    });

    it('should not be able to update avatar from unauthenticated user.', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeStorageProvider = new StorageProviderFake();
        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateAvatar.execute({
                user_id: 'unexistent-id',
                avatarFilename: 'name-avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete an user avatar.', async () => {
        const fakeUsersRepository = new UsersRepositoryFake();
        const fakeStorageProvider = new StorageProviderFake();
        const updateAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const deleteFile = spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Müller Esposito',
            email: 'mulleresposito@hotmail.com',
            password: '123456',
        });

        await updateAvatar.execute({
            user_id: user.id,
            avatarFilename: 'name-avatar1.jpg',
        });

        await updateAvatar.execute({
            user_id: user.id,
            avatarFilename: 'name-avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('name-avatar1.jpg');
        expect(user.avatar).toBe('name-avatar2.jpg');
    });
});
