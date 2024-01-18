import {Link} from "react-router-dom";
import { useSelector } from "react-redux";


const Navbar = ({toggle,setToggle}) => {
    const {user}=useSelector(state=>state.auth);
    return ( 
        <nav style={{clipPath:toggle&&"polygon(0 0, 100% 0, 100% 100%, 0 100%) "}} className="navbar">
                <ul className="nav-links">
                    <Link to="/" onClick={()=>setToggle(false)} className="nav-link">
                        <i className="bi bi-houses"></i>Home
                    </Link>
                    <Link to="/posts" onClick={()=>setToggle(false)} className="nav-link">
                        <i className="bi bi-file-earmark-post"></i>Posts
                    </Link>
                    {
                        user&&(
                            <Link to="/posts/create-post" onClick={()=>setToggle(false)} className="nav-link">
                        <i className="bi bi-journal-text"></i>Create
                    </Link>
                        )
                    }
                    {
                        user?.isAdmin &&(
                            <Link to="/admin-dashboard" onClick={()=>setToggle(false)} className="nav-link">
                        <i className="bi bi-person-lines-fill"></i>Admin
                    </Link>
                        )
                    }
                    
                </ul>
            </nav>
     );
}
 
export default Navbar;