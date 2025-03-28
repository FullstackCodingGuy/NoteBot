import { createFileRoute } from '@tanstack/react-router'
import Notebook from '@/features/notebook'

export const Route = createFileRoute('/_authenticated/')({
  component: Notebook,
})
