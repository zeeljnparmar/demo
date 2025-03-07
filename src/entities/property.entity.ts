import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn ,ManyToOne, OneToOne, JoinColumn, OneToMany, DeleteDateColumn ,CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {User} from  './user.entity'
import { Units } from './unit.entity';
import { Bookings } from './booking.entity';


@Entity()
export class Property {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_name', nullable:false })
  display_name: string;

  @Column({ name: 'description', nullable:false , unique:true})
  description: string;

  @Column({name:'status',nullable:true,default:'Upcoming'})
  status:string

  @Column({ name: 'isactive', nullable:false,default:true})
  isActive: boolean;

  @Column({name:'tenant',default:'AHM001'})
  teant:string;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Units, (units) => units.property)
  units: Units[];

  @OneToMany(() => Bookings, (bookings) => bookings.unit)
  bookings: Bookings[];
  
}