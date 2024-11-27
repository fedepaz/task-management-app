import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ErrorModal } from "@/components/common/ErrorModal";
import { LoginCredentials, RegisterCredentials } from "@task-app/shared";
import { AxiosError } from "axios";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function AuthPage() {
  const { login, register, Error, isLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (Error) {
      console.log(Error);
      setErrorModal({
        show: true,
        message:
          Error instanceof AxiosError
            ? Error.response?.data
            : "An unexpected error occurred while fetching tasks",
      });
    }
  }, [Error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      login({ email, password } as LoginCredentials);
    } else {
      register({
        email,
        password,
        name,
      } as RegisterCredentials);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <ErrorModal
        open={errorModal.show}
        onClose={() => setErrorModal({ show: false })}
        error={errorModal.message}
      />

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full"
                />
              </div>
            )}
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isLogin
                  ? "Signing in..."
                  : "Registering..."
                : isLogin
                  ? "Sign in"
                  : "Register"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
