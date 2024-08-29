import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn ,ManyToOne, OneToOne, JoinColumn, OneToMany, DeleteDateColumn ,CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {Property} from './property.entity'
import { Units } from './unit.entity'; 
import { Bookings } from './booking.entity';

@Entity('tenants')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable:false })
  name: string;

  @Column({ name: 'email', nullable:false , unique:true})
  email: string;

  @Column({ name: 'contact', nullable:false ,unique:true})
  contact: number;

  @Column({ name: 'gender', nullable:false })
  gender: string;

  @Column({ name: 'address', nullable:false })
  address: string;

  @Column({ name: 'rera', nullable:false ,unique:true})
  rera: string;

  @Column({ name: 'comapny', nullable:false})
  company: string;

  @Column({ name: 'password', nullable:false})
  password: string;

  @Column({ name: 'designation', nullable:false})
  designation: string;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @OneToMany(() => Units, (units) => units.user)
  units: Units[];

  @OneToMany(() => Bookings, (bookings) => bookings.user)
  bookings: Bookings[];
}
