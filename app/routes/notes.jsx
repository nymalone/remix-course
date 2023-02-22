import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link, useCatch } from '@remix-run/react'

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
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.' },
      { status: 404, statusText: 'Not found' },
    )
  }
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

// Will catch and render error responses
export function CatchBoundary() {
  const caughtResponse = useCatch()
  const message = caughtResponse.data?.message || 'Data not found'

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  )
}

// This component will be rendered by Remix instead of the App component if an error is thrown IN THIS ROUTE
export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  )
}
