import { createLazyFileRoute } from '@tanstack/react-router'
import Chats from '@/features/notebook'

export const Route = createLazyFileRoute('/_authenticated/notebook/')({
  component: Chats,
})
