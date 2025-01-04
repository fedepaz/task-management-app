import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ErrorModal } from "@/components/common/ErrorModal";
import { LoginCredentials, RegisterCredentials } from "@task-app/shared";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function AuthPage() {
  const { login, register, error, isLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (error) {
      setErrorModal({
        show: true,
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      login({ email, password } as LoginCredentials);
    } else {
      if (password !== confirmPassword) {
        setErrorModal({
          show: true,
          message: "Passwords do not match",
        });
        return;
      }

      register({
        email,
        password,
        confirmPassword,
        name,
      } as RegisterCredentials);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <ErrorModal
          open={errorModal.show}
          onClose={() => setErrorModal({ show: false })}
          error={errorModal.message}
        />

        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-900">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              {isLogin && (
                <>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </>
              )}
              {!isLogin && (
                <>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </>
              )}
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

          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setIsLogin(!isLogin);
                setConfirmPassword("");
              }}
            >
              {isLogin
                ? "Need an account? Register"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
