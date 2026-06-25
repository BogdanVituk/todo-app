import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Header = () => {
  const { isAuthenticated, logoutUser } = useAuth();

  return (
    <header className="bg-gray-800 text-white px-5 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">To-Do App</h1>
        {isAuthenticated ? (
          <button
            onClick={logoutUser}
            className="text-sm px-3 py-1.5 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition font-medium"
          >
            Вийти
          </button>
        ) : (
          <Link to='/login' className="text-sm text-blue-400 hover:text-blue-300 font-medium transition">
            Увійти
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header;