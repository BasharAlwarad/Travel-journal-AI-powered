const UserProfile = ({ user, onLogout, message }) => {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-semibold">Welcome, {user.name}!</h2>
      <button onClick={onLogout} className="w-full btn btn-primary">
        Logout
      </button>
      {message && (
        <div className="mt-4 shadow-lg alert alert-success">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
