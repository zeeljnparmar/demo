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

  @Column({name:'create_at'})
  created_at:Date

  @Column({name:'customer'})
  customer:string;

  @Column({name:'duration',default:'1'})
  duration:number

  @Column({name:'email'})
  email:string

  @Column({name:'budget'})
  budget:number

  @Column({name:'area'})
  area:string

  @Column({name:'category'})
  category:string;

  @Column({name:'tenant',default:'AHM001'})
  teant:string;

  @Column({ name: 'is_Active', nullable:false,default:true})
  is_Active: boolean;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Units, (units) => units.bookings)
  @JoinColumn({ name: 'unit_id' })
  unit: Units;
}