import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../hooks/useAuth";
function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(form, {
 onSuccess: (res) => {
  const data = res.data;

  localStorage.setItem("token", data.token);

  setUser(data.user);

  if (data.user.role === "principal") {
    navigate("/principal/dashboard");
  } else {
    navigate("/teacher/dashboard");
  }
},
      onError: () => {
        alert("Login failed");
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white p-2 rounded"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;