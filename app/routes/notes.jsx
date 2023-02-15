import NewNote, { links as NewNoteLinks } from '~/components/NewNote'

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  )
}

export function action() {
  // whatever I put here will run on the server, not in the browser
}

export function links() {
  return [...NewNoteLinks()] // surfacing styles
}
