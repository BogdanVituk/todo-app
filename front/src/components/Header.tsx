import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


const Header = () => {
    
    const { isAuthenticated, logoutUser } = useAuth();

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold">To-Do App</h1>
                <div className="flex gap-4">
                    {isAuthenticated ? (
                        <button
                            onClick={logoutUser}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                            Вийти
                        </button>
                    ) : (
                        <Link to='/login' className="text-blue-500 hover:text-blue-300 font-medium transition">
                            Увійти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;