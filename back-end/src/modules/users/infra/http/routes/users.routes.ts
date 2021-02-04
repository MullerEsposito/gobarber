import { Router } from 'express';
import multer from 'multer';

import CreateUsersService from '@modules/users/services/CreateUserService';
import UsersRepository from '@modules/users/infra/typeorm/entities/repositories/UsersRepository';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();

    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUsersService(usersRepository);

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        delete user.password;

        return response.status(200).json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const usersRepository = new UsersRepository();

        const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.status(200).json(user);
    },
);

export default usersRouter;
