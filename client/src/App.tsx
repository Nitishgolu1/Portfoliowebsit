import { useMemo, useState } from 'react'

type Project = {
  title: string
  description: string
  url: string
}

type Social = {
  label: string
  url: string
}

function App() {
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)
  const [submitting, setSubmitting] = useState(false)
  const projects: Project[] = useMemo(
    () => [
      { title: 'Project One', description: 'A cool thing I built.', url: 'https://example.com/project-one' },
      { title: 'Project Two', description: 'Another cool thing.', url: 'https://example.com/project-two' },
      { title: 'Project Three', description: 'Yet another cool thing.', url: 'https://example.com/project-three' },
    ],
    [],
  )

  const skills: string[] = useMemo(
    () => [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MySQL',
      'SQL Server',
    ],
    [],
  )

  const services: string[] = useMemo(
    () => [
      'Web App Development',
      'Responsive UI Design',
      'API Integration',
    ],
    [],
  )

  const socials: Social[] = useMemo(
    () => [
      { label: 'GitHub', url: 'https://github.com/' },
      { label: 'LinkedIn', url: 'https://linkedin.com/' },
      { label: 'Twitter', url: 'https://x.com/' },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-indigo-500" aria-hidden />
            <span className="font-semibold">Nitish Kumar</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-indigo-400">Home</a>
            <a href="#projects" className="hover:text-indigo-400">Projects</a>
            <a href="#skills" className="hover:text-indigo-400">Skills</a>
            <a href="#services" className="hover:text-indigo-400">Services</a>
            <a href="#contact" className="hover:text-indigo-400">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-indigo-400 text-sm">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-indigo-400">Hi, I am</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">Nitish Kumar</h1>
          <p className="mt-2 text-xl text-gray-300">Full-Stack Developer</p>
          <p className="mt-6 max-w-2xl text-gray-400">
            I build fast, accessible, and delightful web applications using React, Node.js, and modern tooling.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#projects" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white">View Projects</a>
            <a href="#contact" className="px-4 py-2 border border-gray-700 hover:border-gray-500 rounded">Contact Me</a>
          </div>
        </section>

        <section id="projects" className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group border border-gray-800 rounded-lg p-5 hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 transition"
              >
                <div className="h-36 rounded bg-gradient-to-br from-gray-800 to-gray-900 mb-4" />
                <h3 className="font-medium group-hover:text-indigo-400">{p.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{p.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="skills" className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full border border-gray-700 text-sm text-gray-300">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section id="services" className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Services</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s} className="p-5 border border-gray-800 rounded-lg">{s}</li>
            ))}
          </ul>
        </section>

        <section id="contact" className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <form
            className="mt-6 grid gap-4 max-w-xl"
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitStatus(null)
              setSubmitting(true)
              const form = e.currentTarget as HTMLFormElement
              const formData = new FormData(form)
              const payload = Object.fromEntries(formData.entries()) as { name: string; email: string; message: string }
              try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error('Request failed')
                setSubmitStatus('success')
                form.reset()
              } catch {
                setSubmitStatus('error')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <input name="name" placeholder="Your name" className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <input name="email" type="email" placeholder="Your email" className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <textarea name="message" placeholder="Your message" rows={5} className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded text-white w-fit">
                {submitting ? 'Sending…' : 'Send'}
              </button>
              {submitStatus === 'success' && <span className="text-sm text-emerald-400">Sent! I will get back to you soon.</span>}
              {submitStatus === 'error' && <span className="text-sm text-rose-400">Something went wrong. Please try again.</span>}
            </div>
          </form>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-400 flex justify-between">
          <span>© {new Date().getFullYear()} Nitish Kumar</span>
          <a href="#home" className="hover:text-indigo-400">Back to top</a>
        </div>
      </footer>
    </div>
  )
}

export default App
