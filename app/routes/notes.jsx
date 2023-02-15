import { redirect } from '@remix-run/node'
import NewNote, { links as newNoteLinks } from '~/components/NewNote'
import NoteList, { links as noteListLinks } from '../components/NoteList'
import { getStoredNotes, storeNotes } from '../data/notes'

export default function NotesPage() {
  return (
    <main>
      <NewNote />
      <NoteList />
    </main>
  )
}

export function loader() {}

export async function action({ request }) {
  // whatever I put here will run on the server, not in the browser
  const formData = await request.formData() // get the information from the form
  const noteData = Object.fromEntries(formData) // this will get the entries from the inputs in the form

  //Add validation...

  const existingNotes = await getStoredNotes() // store notes
  noteData.id = new Date().toISOString()
  const updatedNotes = existingNotes.concat(noteData)
  await storeNotes(updatedNotes)

  return redirect('/notes') // redirect user
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()] // surfacing styles
}
