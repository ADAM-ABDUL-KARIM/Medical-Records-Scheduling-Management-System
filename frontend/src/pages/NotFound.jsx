import { useNavigate } from 'react-router-dom';
import '../styles/BackArrow.css';
function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 Not Found - 403 Forbidden</h1>
      <p>The page You are looking for does not exist or <span className="back-arrow404span">secrect stuff you should not see</span></p>
      <div className="back-arrow404" onClick={() => navigate("/")}>
      &#8592; Back Home
    </div>
    </div>
  );
}

export default NotFound;
