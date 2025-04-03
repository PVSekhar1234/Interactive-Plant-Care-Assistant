import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [oobCode, setOobCode] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (!code) {
      setMessage('Invalid or expired password reset link.');
      return;
    }

    // Verify if the password reset link is valid
    verifyPasswordResetCode(auth, code)
      .then(() => {
        setOobCode(code);
      })
      .catch(() => {
        setMessage('Invalid or expired password reset link.');
      });
  }, [searchParams, auth]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!oobCode) return;

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('Failed to reset password. The link might have expired.');
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
        {message && <p className="text-red-500">{message}</p>}
        {oobCode && (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2"
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
