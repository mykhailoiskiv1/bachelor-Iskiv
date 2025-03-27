import type { Post, User } from '@prisma/client'

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'email'>
}
