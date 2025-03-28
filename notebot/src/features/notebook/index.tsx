/**
 * Notebook application
 */
import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import {
  IconArrowLeft,
  IconEdit,
  IconMessages,
  IconPencilCheck,
  IconPencilX,
  IconSearch,
} from '@tabler/icons-react'
import useNoteBookStore, { Note } from '@/stores/notebookStore'
import { cn, SanitizedHTML } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatUser } from './data/chat-types'
// Fake Data
import { conversations } from './data/convo.json'

export default function Notebook() {
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null
  )
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)

  const { notes, loadNotes } = useNoteBookStore()

  const [editMode, seteditMode] = useState(false)

  // Load the notes
  useEffect(() => {
    loadNotes()

    // if (selectedNote) {
    //   console.log('fetching content..')
    //   fetchWikiContent(selectedNote.title).then((content) => {
    //     setSelectedNote({
    //       ...selectedNote,
    //       content: content,
    //     })
    //     console.log('Content:', content)
    //   })
    // }
  }, [loadNotes])

  // Filtered data based on the search query
  // const filteredChatList = conversations.filter(({ fullName }) =>
  //   fullName.toLowerCase().includes(search.trim().toLowerCase())
  // )

  // const currentMessage = selectedUser?.messages.reduce(
  //   (acc: Record<string, Convo[]>, obj) => {
  //     const key = format(obj.timestamp, 'd MMM, yyyy')

  //     // Create an array for the category if it doesn't exist
  //     if (!acc[key]) {
  //       acc[key] = []
  //     }

  //     // Push the current object to the array
  //     acc[key].push(obj)

  //     return acc
  //   },
  //   {}
  // )

  const users = conversations.map(({ messages, ...user }) => user)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <Search /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Notebook</h1>
                  {/* <IconNotebook size={20} /> */}
                </div>

                <Button size='icon' variant='ghost' className='rounded-lg'>
                  <IconEdit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label className='mt-2 flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Search notebook...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full p-3'>
              {notes.map((note) => (
                <Fragment key={note.id}>
                  <button
                    type='button'
                    className={cn(
                      `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`
                    )}
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className='flex gap-2'>
                      <div>
                        <span className='col-start-2 row-span-2 font-medium'>
                          {SanitizedHTML(note.title)}
                        </span>
                      </div>
                    </div>
                  </button>
                  <Separator className='my-1' />
                </Fragment>
              ))}
            </ScrollArea>
          </div>

          {/* Right Side */}

          {selectedNote ? (
            <div
              className={cn(
                'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
                mobileSelectedUser && 'left-0 flex'
              )}
            >
              {/* Top Part */}
              <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
                {/* Left */}
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ml-2 h-full sm:hidden'
                    onClick={() => setMobileSelectedUser(null)}
                  >
                    <IconArrowLeft />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedNote.title}
                      </span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        {selectedNote.updated &&
                          format(selectedNote.updated, 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                  {!editMode && (
                    <Button
                      size='icon'
                      variant='ghost'
                      className='mr-4 hidden size-8 rounded-full sm:inline-flex lg:size-10'
                      onClick={() => seteditMode(true)}
                    >
                      <IconEdit size={22} className='stroke-muted-foreground' />{' '}
                      Edit
                    </Button>
                  )}
                  {editMode && (
                    <>
                      <Button variant='default'>
                        <IconPencilCheck
                          size={22}
                          className='stroke-muted-foreground'
                        />{' '}
                        Save
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='mx-5 hidden size-8 rounded-full sm:inline-flex lg:size-10'
                        onClick={() => seteditMode(false)}
                      >
                        <IconPencilX
                          size={22}
                          className='stroke-muted-foreground'
                        />{' '}
                        Cancel
                      </Button>
                    </>
                  )}
                  {/* <Button
                    size='icon'
                    variant='ghost'
                    className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                  >
                    <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                  </Button> */}
                </div>
              </div>

              {/* Markdown Content */}
              {/* <Markdown>{}</Markdown> */}

              <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-4'>
                <div className='flex size-full flex-1'>
                  <Fragment>
                    <div>
                      {selectedNote.content}{' '}
                      <span
                        className={cn(
                          'mt-1 block text-xs font-light italic text-muted-foreground'
                        )}
                      >
                        Created:{' '}
                        {selectedNote.created &&
                          format(selectedNote.created, 'h:mm a')}
                      </span>
                    </div>
                    {/* <div className='text-center text-xs'>{"asdf"}</div> */}
                  </Fragment>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex'
              )}
            >
              <div className='flex flex-col items-center space-y-6'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-white'>
                  <IconMessages className='h-8 w-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h1 className='text-xl font-semibold'>Your notes</h1>
                  <p className='text-sm text-gray-400'>Create a new chat.</p>
                </div>
                <Button
                  className='bg-blue-500 px-6 text-white hover:bg-blue-600'
                  onClick={() => setCreateConversationDialog(true)}
                >
                  Send message
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  )
}
