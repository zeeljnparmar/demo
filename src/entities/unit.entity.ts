import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn ,ManyToOne, OneToOne, JoinColumn, OneToMany, DeleteDateColumn ,CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {User} from  './user.entity'
import {Property} from  './property.entity'
import { Bookings } from './booking.entity';

@Entity()
export class Units {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', nullable:false })
  type: string;

  @Column({ name: 'block', nullable:false , unique:true})
  block: string;

  @Column({ name: 'floor', nullable:false , unique:true})
  floor: string;

  @Column({ name: 'unit_no', nullable:false , unique:true})
  unit_no: string;

  @Column({ name: 'unit_size', nullable:false , unique:true})
  unit_size: string;

  @Column({ name: 'is_Active', nullable:false,default:true})
  is_Active: boolean;

  @ManyToOne(() => User, (user) => user.units)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Property, (property) => property.units)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => Bookings, (bookings) => bookings.unit)
  bookings: Bookings[];
}