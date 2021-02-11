import { v4 } from 'uuid';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import { isEqual } from 'date-fns';

class AppointmentsRepositoryFake implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointment;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentsDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: v4(), provider_id, date });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepositoryFake;
