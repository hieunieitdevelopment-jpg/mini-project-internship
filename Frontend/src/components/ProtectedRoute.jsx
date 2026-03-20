import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  let isAdmin = false;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Quét quyền Admin tương tự như trên Header
      isAdmin = user && (
        String(user.role).toLowerCase() === 'admin' ||
        String(user.user?.role).toLowerCase() === 'admin' ||
        String(user.data?.role).toLowerCase() === 'admin'
      );
    } catch (e) {
      isAdmin = false;
    }
  }

  // Nếu không phải Admin, đẩy thẳng về trang chủ (hoặc trang login tùy ý)
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;