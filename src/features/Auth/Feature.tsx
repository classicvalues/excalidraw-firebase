import React, { useReducer } from "react";
import {
  useEnterEffect,
  useEvents,
  createContext,
  createHook,
  createReducer,
} from "react-states";

import { useDevtools } from "react-states/devtools";
import { useEnvironment } from "../../environment";
import { AuthenticationEvent, User } from "../../environment/authentication";

export type Context =
  | {
      state: "CHECKING_AUTHENTICATION";
    }
  | {
      state: "UNAUTHENTICATED";
    }
  | {
      state: "SIGNING_IN";
    }
  | {
      state: "AUTHENTICATED";
      user: User;
    }
  | {
      state: "ERROR";
      error: string;
    };

export type UIEvent = {
  type: "SIGN_IN";
};

export type Event = UIEvent | AuthenticationEvent;

const featureContext = createContext<Context, UIEvent>();

export const useFeature = createHook(featureContext);

const reducer = createReducer<Context, Event>({
  CHECKING_AUTHENTICATION: {
    "AUTHENTICATION:AUTHENTICATED": ({ user }): Context => ({
      state: "AUTHENTICATED",
      user,
    }),
    "AUTHENTICATION:UNAUTHENTICATED": (): Context => ({
      state: "UNAUTHENTICATED",
    }),
  },
  UNAUTHENTICATED: {
    SIGN_IN: (): Context => ({ state: "SIGNING_IN" }),
  },
  SIGNING_IN: {
    "AUTHENTICATION:AUTHENTICATED": ({ user }): Context => ({
      state: "AUTHENTICATED",
      user,
    }),
    "AUTHENTICATION:SIGN_IN_ERROR": ({ error }): Context => ({
      state: "ERROR",
      error,
    }),
  },
  AUTHENTICATED: {},
  ERROR: {},
});

export const FeatureProvider = ({
  children,
  initialContext = {
    state: "CHECKING_AUTHENTICATION",
  },
}: {
  children: React.ReactNode;
  initialContext?: Context;
}) => {
  const { authentication } = useEnvironment();
  const feature = useReducer(reducer, initialContext);

  if (process.env.NODE_ENV === "development") {
    useDevtools("auth", feature);
  }

  const [context, send] = feature;

  useEvents(authentication.events, send);

  useEnterEffect(context, "SIGNING_IN", () => authentication.signIn());

  return (
    <featureContext.Provider value={feature}>
      {children}
    </featureContext.Provider>
  );
};