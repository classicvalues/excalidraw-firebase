import { Subscription } from "react-states";

export type StorageError = {
  type: "ERROR";
  data: string;
};

export type ExcalidrawElement = {
  id: string;
  version: number;
} & any;

export type ExcalidrawMetadata = {
  id: string;
  author: string;
  last_updated: Date;
  title: string;
};

export type ExcalidrawData = {
  elements: readonly ExcalidrawElement[];
  appState: { viewBackgroundColor: string };
  version: number;
};

export type ExcalidrawPreview = {
  metadata: ExcalidrawMetadata;
  user: {
    uid: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type ExcalidrawPreviews = ExcalidrawPreview[];

export type StorageAction =
  | {
      type: "STORAGE:FETCH_EXCALIDRAW_SUCCESS";
      metadata: ExcalidrawMetadata;
      data: ExcalidrawData;
      image: Blob;
    }
  | {
      type: "STORAGE:FETCH_EXCALIDRAW_ERROR";
      error: string;
    }
  | {
      type: "STORAGE:EXCALIDRAW_DATA_UPDATE";
      id: string;
      data: ExcalidrawData;
    }
  | {
      type: "STORAGE:CREATE_EXCALIDRAW_SUCCESS";
      id: string;
    }
  | {
      type: "STORAGE:CREATE_EXCALIDRAW_ERROR";
      error: string;
    }
  | {
      type: "STORAGE:SAVE_EXCALIDRAW_SUCCESS";
      metadata: ExcalidrawMetadata;
      image: Blob;
    }
  | {
      type: "STORAGE:SAVE_EXCALIDRAW_ERROR";
      error: string;
    }
  | {
      type: "STORAGE:FETCH_PREVIEWS_SUCCESS";
      excalidraws: ExcalidrawPreviews;
    }
  | {
      type: "STORAGE:FETCH_PREVIEWS_ERROR";
      error: string;
    }
  | {
      type: "STORAGE:FETCH_USER_PREVIEWS_SUCCESS";
      excalidraws: ExcalidrawPreviews;
    }
  | {
      type: "STORAGE:FETCH_USER_PREVIEWS_ERROR";
      error: string;
    }
  | {
      type: "STORAGE:IMAGE_SRC_SUCCESS";
      id: string;
      src: string;
    }
  | {
      type: "STORAGE:IMAGE_SRC_ERROR";
      id: string;
      error: string;
    }
  | {
      type: "STORAGE:SAVE_TITLE_SUCCESS";
      id: string;
      title: string;
    }
  | {
      type: "STORAGE:SAVE_TITLE_ERROR";
      id: string;
      title: string;
      error: string;
    };

export interface Storage {
  subscription: Subscription<StorageAction>;
  createExcalidraw(userId: string): void;
  fetchExcalidraw(userId: string, id: string): void;
  fetchPreviews(): void;
  fetchUserPreviews(uid: string): void;
  saveExcalidraw(userId: string, id: string, data: ExcalidrawData): void;
  getImageSrc(userId: string, id: string): void;
  saveTitle(userId: string, id: string, title: string): void;
}
