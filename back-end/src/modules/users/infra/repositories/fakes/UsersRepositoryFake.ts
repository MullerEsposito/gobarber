import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRespository from '@modules/users/infra/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { v4 } from 'uuid';

class UsersRepositoryFake implements IUsersRespository {
    private fakeUsersRepository: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const foundUser = this.fakeUsersRepository.find(user => user.id === id);

        return foundUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = this.fakeUsersRepository.find(
            user => user.email === email,
        );

        return foundUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: v4() }, userData);

        this.fakeUsersRepository.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const foundIndex = this.fakeUsersRepository.findIndex(
            findUser => findUser.id === user.id,
        );

        this.fakeUsersRepository.splice(foundIndex, 1, user);

        return user;
    }
}

export default UsersRepositoryFake;
