declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
