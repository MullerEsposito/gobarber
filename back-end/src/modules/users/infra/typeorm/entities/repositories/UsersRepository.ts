import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRespository from '@modules/users/infra/repositories/IUsersRepository';
import { getRepository, Repository } from 'typeorm';
import User from '../User';

class UsersRepository implements IUsersRespository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = await this.ormRepository.create(userData);

        return this.ormRepository.save(user);
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;
