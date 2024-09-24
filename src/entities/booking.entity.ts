import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Units } from './unit.entity';

@Entity('bookings')
export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingDate: Date;

  @Column({name:'remarks',default:'inquiry remarks'})
  remarks: string;

  @Column({ name: 'is_Active', nullable:false,default:true})
  is_Active: boolean;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Units, (units) => units.bookings)
  @JoinColumn({ name: 'unit_id' })
  unit: Units;
}