import { createLazyFileRoute } from '@tanstack/react-router'
import Notebook from '@/features/notebook'

export const Route = createLazyFileRoute('/_authenticated/notebook/')({
  component: Notebook,
})
