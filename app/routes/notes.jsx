import { redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import NewNote, { links as newNoteLinks } from '~/components/NewNote'
import NoteList, { links as noteListLinks } from '~/components/NoteList'
import { getStoredNotes, storeNotes } from '../data/notes'

export default function NotesPage() {
  const notes = useLoaderData() // return data from loader

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export async function loader() {
  const notes = await getStoredNotes()
  return notes

  // return new Response(JSON.stringify(notes), {
  //   headers: { 'Content-type': 'application/json' },
  // })

  //return json(notes)
}

export async function action({ request }) {
  // whatever I put here will run on the server, not in the browser
  const formData = await request.formData() // get the information from the form
  const noteData = Object.fromEntries(formData) // this will get the entries from the inputs in the form

  //Add validation - actions can return data!
  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid title - must be at least 5 characters long.' }
  }

  const existingNotes = await getStoredNotes() // store notes
  noteData.id = new Date().toISOString()
  const updatedNotes = existingNotes.concat(noteData)
  await storeNotes(updatedNotes)

  return redirect('/notes') // redirect user
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()] // surfacing styles
}
