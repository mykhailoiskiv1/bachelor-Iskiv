import { type Post, type User } from '@prisma/client'

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'email'>
}
