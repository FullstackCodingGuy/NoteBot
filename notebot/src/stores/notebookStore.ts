import { create } from 'zustand'

// Define the shape of the note object
export interface Note {
  id: string
  title: string
  content: string
  created: string
  updated: string
}

interface NoteBookStore {
  notes: Note[]
  addNote: (note: Note) => void
  deleteNote: (note: Note) => void
  updateNote: (note: Note) => void
  setNotes: (notes: Note[]) => void
  loadNotes: () => void
}

const useNoteBookStore = create<NoteBookStore>((set) => ({
  /**
   * Keep the below lines to troubleshoot in case needed
   */
  //   count: 0,
  //   increase: () => set((state) => ({ count: state.count + 1 })),
  //   decrease: () => set((state) => ({ count: state.count - 1 })),
  //   reset: () => set({ count: 0 })),

  notes: [],
  addNote: (note: Note) => set((state) => ({ notes: [...state.notes, note] })),
  deleteNote: (note: Note) =>
    set((state) => ({ notes: state.notes.filter((n) => n !== note) })),
  updateNote: (note: Note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === note.id ? note : n)),
    })),
  setNotes: (notes: Note[]) => set({ notes }),
  loadNotes: () => {
    const notes: Note[] = [
      {
        id: '1',
        title: 'First Note',
        content: 'This is the first note',
        created: '2021-01-01',
        updated: '2021-01-01',
      },
      {
        id: '2',
        title: 'Second Note',
        content: 'This is the second note',
        created: '2021-01-02',
        updated: '2021-01-02',
      },
      {
        id: '3',
        title: 'Third Note',
        content: 'This is the third note',
        created: '2021-01-03',
        updated: '2021-01-03',
      },
    ]
    set({ notes })
  },
}))

export default useNoteBookStore
