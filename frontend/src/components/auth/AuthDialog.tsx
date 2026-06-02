import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "sign-in" | "register";
}) {
  const [activeTab, setActiveTab] = useState<"sign-in" | "register">(
    defaultTab || "sign-in",
  );
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  //handle login and register form submissions
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      onOpenChange(false);
      toast.success("Signed in successfully");
    } catch {
      setError("Invalid email or password.");
    }
  };
  //handle login and register form submissions
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await register(email, password, firstName, lastName);
      onOpenChange(false);
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-100 mx-auto bg-amber-50">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Sign in to continue / create a new account
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Tabs
          defaultValue={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as "sign-in" | "register");
            setError(null);
          }}
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="space-y-4">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="sign-in-email">Email address</Label>
                <Input
                  id="sign-in-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sign-in-password">Password</Label>
                <Input
                  id="sign-in-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <Label htmlFor="register-firstName">First name</Label>
                <Input
                  id="register-firstName"
                  name="firstName"
                  type="text"
                  placeholder="Ahmed"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-lastName">Last name</Label>
                <Input
                  id="register-lastName"
                  name="lastName"
                  type="text"
                  placeholder="Eldessouki"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email address</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            className="text-black"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
