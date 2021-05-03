import { Events } from "react-states";

export type User = {
  uid: string;
  name: string;
  avatarUrl: string | null;
};

export type AuthenticationEvent =
  | {
      type: "AUTHENTICATION:AUTHENTICATED";
      user: User;
    }
  | {
      type: "AUTHENTICATION:UNAUTHENTICATED";
    }
  | {
      type: "AUTHENTICATION:SIGN_IN_ERROR";
      error: string;
    };

export interface Authentication {
  events: Events<AuthenticationEvent>;
  signIn(): void;
}