import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Appointment {
  id: string;
  details: string; // Ex: "Consulta com Dr. João"
  date: string;    // Ex: "25/07/2025"
  time: string;    // Ex: "15:30"
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  userPhone: string;
}

@Injectable()
export class SchedulingService {
  // Em produção, isso seria uma tabela no seu banco de dados.
  private appointments: Appointment[] = [];

  createProposedAppointment(
    userPhone: string,
    details: string,
    date: string,
    time: string,
  ): Appointment {
    const newAppointment: Appointment = {
      id: randomUUID(),
      userPhone,
      details,
      date,
      time,
      status: 'PENDING',
    };
    this.appointments.push(newAppointment);
    console.log('Agendamento PENDENTE criado:', newAppointment);
    return newAppointment;
  }

  confirmAppointment(id: string): Appointment | null {
    const appointment = this.appointments.find((a) => a.id === id);
    if (appointment) {
      appointment.status = 'CONFIRMED';
      console.log('Agendamento CONFIRMADO:', appointment);
      return appointment;
    }
    return null;
  }

  cancelAppointment(id: string): Appointment | null {
    const appointment = this.appointments.find((a) => a.id === id);
    if (appointment) {
      appointment.status = 'CANCELED';
      console.log('Agendamento CANCELADO:', appointment);
      return appointment;
    }
    return null;
  }
  
  getAppointment(id: string): Appointment | null {
      const appointment = this.appointments.find((a) => a.id === id);
      return appointment ?? null;
  }
}