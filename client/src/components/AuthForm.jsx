import { useState } from 'react';

const AuthForm = ({
  isRegistering,
  formData,
  setFormData,
  onSubmit,
  toggleForm,
  message,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        {isRegistering ? 'Register' : 'Login'}
      </h2>

      {message && (
        <div className="shadow-lg alert alert-error">
          <span>{message}</span>
        </div>
      )}

      {isRegistering && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="w-full input input-bordered"
            required
          />
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="w-full input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          className="w-full input input-bordered"
          required
        />
      </div>

      {isRegistering && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Profile Image URL</span>
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            placeholder="Image URL"
            className="w-full input input-bordered"
          />
        </div>
      )}

      <button type="submit" className="w-full btn btn-primary">
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <p
        className="mt-2 text-center cursor-pointer text-blue-500"
        onClick={toggleForm}
      >
        {isRegistering
          ? 'Already have an account? Login'
          : 'Do not have an account? Register'}
      </p>
    </form>
  );
};

export default AuthForm;
