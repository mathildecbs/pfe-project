import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../utils/base_entity/base_entity.service";
import { User } from "../../user/entities/user.entity";
import { Post } from "./post.entity";

@Entity()
export class Repost extends BaseEntity{

    @ManyToOne(()=> User, (user)=> user.reposts, {eager: true, onDelete:"CASCADE"})
    user: User

    @ManyToOne(()=> Post, (post)=> post.reposts, {eager: true, onDelete: "CASCADE"})
    post: Post

}
