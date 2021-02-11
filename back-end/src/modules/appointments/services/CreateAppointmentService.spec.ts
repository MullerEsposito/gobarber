import AppointmentsRepositoryFake from '@modules/appointments/infra/repositories/fakes/AppointmentsRepositoryFake';
import AppError from '@shared/errs/AppError';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentRepository = new AppointmentsRepositoryFake();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentRepository = new AppointmentsRepositoryFake();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
