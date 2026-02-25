import { Navigate } from 'react-router-dom';

// Registration is now handled on the Login page via the dual-panel auth UI.
// This component simply redirects to /login for backwards compatibility.
const Register = () => <Navigate to="/login" replace />;

export default Register;
