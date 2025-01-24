import { useNavigate } from 'react-router-dom';
import '../styles/BackArrow.css';

function BackArrow() {
  const navigate = useNavigate();

  return (
    <div className="back-arrow" onClick={() => navigate('/')}>
      &#8592; Back to Dashboard
    </div>
  );
}

export default BackArrow;