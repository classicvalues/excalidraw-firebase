import { exportToCanvas } from "./excalidraw-src/scene/export";
import { CreateExcalidrawImage } from ".";
import { result } from "react-states";

export const canvasToBlob = async (
  canvas: HTMLCanvasElement
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error("Unable to create blob"));
        }
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const createCreateExcalidrawImage = (): CreateExcalidrawImage => (
  elements,
  appState
) => {
  const canvas = exportToCanvas(
    elements.filter((element) => !element.isDeleted),
    appState,
    {
      exportBackground: true,
      shouldAddWatermark: false,
      viewBackgroundColor: "#FFF",
      exportPadding: 10,
      scale: 1,
    }
  );

  return result((ok, err) =>
    canvasToBlob(canvas)
      .then((blob) => ok(blob))
      .catch((error: Error) => err("ERROR", error))
  );
};