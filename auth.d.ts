declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string; // Optional avatar field
  }

  // interface UserSession {
  //   user: {
  //     id: number;
  //     name: string;
  //     email: string;
  //     avatar?: string; // Optional avatar field
  //   };
  // }

  // interface UserSession {
  //   user: {
  //     id: number;
  //     name: string;
  //     email: string;
  //     avatar?: string; // Optional avatar field
  //   };
  // }
}

export {};
