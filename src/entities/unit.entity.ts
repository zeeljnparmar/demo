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

  @Column({ name: 'block', nullable:false})
  block: string;

  @Column({ name: 'floor', nullable:false})
  floor: string;

  @Column({ name: 'unit_no', nullable:false})
  unit_no: string;

  @Column({ name: 'unit_size', nullable:false})
  unit_size: string;

  @Column({name:'status', default:'Sale'})
  status:string
  
  @Column({ name: 'isactive', nullable:false,default:true})
  isactive: boolean;

  @Column({name:'tenant',default:'AHM001'})
  teant:string;
  
  @ManyToOne(() => User, (user) => user.units)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Property, (property) => property.units)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => Bookings, (bookings) => bookings.unit)
  bookings: Bookings[];
}