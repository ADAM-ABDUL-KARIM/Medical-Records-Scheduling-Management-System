import { useNavigate } from 'react-router-dom';
import '../styles/BackArrow.css';

function BackArrow({ position = "top" }) {
  const navigate = useNavigate();

  return (
    <div
      className={`back-arrow ${position}`}
      onClick={() => navigate('/')}
    >
      ← Back to Dashboard
    </div>
  );
}

export default BackArrow; 