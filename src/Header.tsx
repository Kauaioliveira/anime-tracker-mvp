import { Link } from 'react-router-dom'

type HeaderProps = {
  title: string
  description: string
}

function Header({ title, description }: HeaderProps) {
  return (
    <header className="app-header">
      <p>
        <Link to="/favorites">Favorites</Link>
      </p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

export default Header
