import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    role: string;
    email: string;
    image: string;
  }

  interface Session {
    user: User;
    role: string;
  }
}
