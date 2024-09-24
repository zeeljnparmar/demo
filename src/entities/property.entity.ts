import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn ,ManyToOne, OneToOne, JoinColumn, OneToMany, DeleteDateColumn ,CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {User} from  './user.entity'
import { Units } from './unit.entity';


@Entity()
export class Property {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_name', nullable:false })
  display_name: string;

  @Column({ name: 'description', nullable:false , unique:true})
  description: string;

  @Column({ name: 'is_Active', nullable:false,default:true})
  is_Active: boolean;


  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Units, (units) => units.property)
  units: Units[];

}