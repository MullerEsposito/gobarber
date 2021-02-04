import ICreateAppointmentsDTO from '@modules/appointments/dto/ICreateAppointmentsDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IAppointmentsRepository {
    create(data: ICreateAppointmentsDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
}

export default IAppointmentsRepository;
