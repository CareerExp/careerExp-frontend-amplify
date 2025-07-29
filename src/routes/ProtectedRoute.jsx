import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getPaymentStatus, selectIsPaid, selectRemainingAttempts } from "../redux/slices/paymentSlice.js";
import { selectAuthenticated, selectUserId, selectToken } from "../redux/slices/authSlice.js";

const PaidUserRoute = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Selectors
  const authenticated = useSelector(selectAuthenticated);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isPaid = useSelector(selectIsPaid);
  const remainingAttempts = useSelector(selectRemainingAttempts);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const verifyPaymentStatus = async () => {
      if (!authenticated) {
        if (isMounted) setIsLoading(false);
        return;
      }

      if (userId && token) {
        try {
          setIsLoading(true);
          await dispatch(getPaymentStatus({ userId, token })).unwrap();
        } catch (error) {
          console.error("Payment verification failed:", error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    verifyPaymentStatus();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [authenticated, dispatch, userId, token]);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to free version if not paid user
  if (!isPaid) {
    return <Navigate to="/assessment-result" replace />;
  }

  // Render protected content for paid users
  return <Outlet />;
};

export default PaidUserRoute;
