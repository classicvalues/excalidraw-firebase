import React, { createContext, useContext, useEffect } from "react";
import { States, useStates } from "react-states";
import { useDevtools } from "react-states/devtools";
import { useExternals } from "../externals";
import { User } from "../types";

type Context =
  | {
      state: "AUTHENTICATING";
    }
  | {
      state: "UNAUTHENTICATED";
      error?: string;
    }
  | {
      state: "SIGNING_IN";
    }
  | {
      state: "AUTHENTICATED";
      user: User;
    };

type Action =
  | {
      type: "SIGN_IN";
    }
  | {
      type: "SIGN_IN_SUCCESS";
      user: User;
    }
  | {
      type: "SIGN_IN_ERROR";
      error: string;
    };

const authContext = createContext({} as States<Context, Action>);

export const useAuth = () => useContext(authContext);

export const useAuthenticatedAuth = () => {
  const auth = useAuth();

  if (auth.is("AUTHENTICATED")) {
    return auth;
  }

  throw new Error(
    "You are not using the Auth provider in an Authenticated component"
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const externals = useExternals();
  const auth = useStates<Context, Action>(
    {
      AUTHENTICATING: {
        SIGN_IN_SUCCESS: ({ user }) => ({
          state: "AUTHENTICATED",
          user,
        }),
        SIGN_IN_ERROR: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
      },
      UNAUTHENTICATED: {
        SIGN_IN: () => ({ state: "SIGNING_IN" }),
      },
      SIGNING_IN: {
        SIGN_IN_SUCCESS: ({ user }) => ({
          state: "AUTHENTICATED",
          user,
        }),
        SIGN_IN_ERROR: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
      },
      AUTHENTICATED: {},
    },
    {
      state: "AUTHENTICATING",
    }
  );

  useDevtools("auth", auth as any);

  useEffect(
    () =>
      auth.exec({
        SIGNING_IN: () => {
          externals.auth
            .signIn()
            .then((user) => {
              if (!user) {
                auth.dispatch({
                  type: "SIGN_IN_ERROR",
                  error: "Authenticated, but no user",
                });
              }
            })
            .catch((error) => {
              auth.dispatch({
                type: "SIGN_IN_ERROR",
                error: error.message,
              });
            });
        },
        AUTHENTICATING: () => {
          externals.auth.onAuthChange((user) => {
            if (user) {
              auth.dispatch({ type: "SIGN_IN_SUCCESS", user });
            } else {
              auth.dispatch({
                type: "SIGN_IN_ERROR",
                error: "Not authenticated",
              });
            }
          });
        },
      }),
    [auth]
  );

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};