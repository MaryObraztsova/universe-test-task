import { imagesFormat } from "../constants/interactor";
import { useRemoteConfig } from "../providers/remote-config-provider";
import { API } from "../services/api";
import { ApiFile } from "../services/api/types";
import { InternalFileType } from "../types/interactor";
import { generatePDFCover } from "../use-cases/generate-pdf-cover";
import { useRouter } from "next/router";
import React from "react";

export interface IUseFileLoader {
  imagePDF: Blob | null;
  isImageLoading: boolean;
  fileType: string | null;
  fileLink: string | null;
  fileName: string | null;
}

export const useFileLoader = (): IUseFileLoader => {
  const router = useRouter();

  const [file, setFile] = React.useState<ApiFile>();
  const [imagePDF, setImagePDF] = React.useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [fileLink, setFileLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    API.files.getFiles().then((res) => {
      if (router.query?.file) {
        const chosenFile = res.files.find(
          (item) => item.id === router.query!.file
        );

        setFile(chosenFile);

        return;
      }
      setFile(res.files[res.files.length - 1]);
    });
  }, []);

  // @NOTE: generating cover for pdf-documents
  const loadPdfCover = React.useCallback(async (): Promise<void> => {
    if (!file || file.internal_type !== "PDF") {
      return;
    }

    setIsImageLoading(true);

    try {
      const fileUrl = await (async () => {
        if (router.query?.file) {
          return JSON.parse(router.query.editedFile as string)
            ? API.files
                .editedFile(router.query.file as string)
                .then((r) => r.url)
            : API.files
                .downloadFile(router.query.file as string)
                .then((r) => r.url);
        }

        return API.files.downloadFile(file.id).then((r) => r.url);
      })();

      const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: 640,
      });
      setImagePDF(pdfCover);
    } finally {
      setIsImageLoading(false);
    }
  }, [file]);

  const loadImageCover = React.useCallback(async () => {
    if (
      !file ||
      !imagesFormat.includes(file.internal_type) ||
      // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
      !imagesFormat.includes(
        file.filename.slice(-3).toUpperCase() as InternalFileType
      ) ||
      !imagesFormat.includes(
        file.filename.slice(-4).toUpperCase() as InternalFileType
      )
    ) {
      return;
    }
    const fileUrl = await (async () => {
      if (router.query?.file) {
        return router.query.editedFile === "true"
          ? API.files.editedFile(router.query.file as string).then((r) => r.url)
          : API.files
              .downloadFile(router.query.file as string)
              .then((r) => r.url);
      }

      return API.files.downloadFile(file.id).then((r) => r.url);
    })();

    setFileLink(fileUrl);
  }, []);

  React.useEffect(() => {
    loadPdfCover();
    loadImageCover();
  }, [loadImageCover, loadPdfCover]);

  return {
    imagePDF: imagePDF ?? null,
    isImageLoading,
    fileName: file?.filename ?? null,
    fileType: file?.internal_type ?? null,
    fileLink,
  };
};
