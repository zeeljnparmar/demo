import { Entity,Column,PrimaryGeneratedColumn,OneToMany} from 'typeorm';
import {Property} from './property.entity'
import { Units } from './unit.entity'; 
import { Bookings } from './booking.entity';

@Entity()
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

  @Column({ name: 'rera', nullable:false})
  rera: string;

  @Column({ name: 'company', nullable:false})
  company: string;

  @Column({ name: 'password', nullable:false})
  password: string;

  @Column({ name: 'designation', nullable:true,default:'Broker'})
  designation: string;

  @Column({name:'isapproved',nullable:true,default:false})
  isApproved:boolean;

  @Column({name:'tenant',default:'AHM001'})
  teant:string;

  @Column({name:'status',default:'true'})
  status:boolean;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @OneToMany(() => Units, (units) => units.user)
  units: Units[];

  @OneToMany(() => Bookings, (bookings) => bookings.user)
  bookings: Bookings[];
}
