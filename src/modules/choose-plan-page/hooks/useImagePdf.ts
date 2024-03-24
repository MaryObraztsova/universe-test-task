import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { generatePDFCover } from '../../../use-cases/generate-pdf-cover';
import { API } from '../../../services/api';
import { ImagePdfHook } from '../interactor.types';


export const useImagePdf: ImagePdfHook = (file) => {
  const {query} = useRouter();

  const [imagePDF, setImagePDF] = useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const loadPdfCover = useCallback(async () => {
    if (!file || file.internal_type !== "PDF") {
      throw new Error("File is missed or not a PDF format");
    }

    setIsImageLoading(true);

    try {
      const fileUrl = await (async () => {
        if (query?.file) {
          return query.editedFile === "true"
            ? API.files
                .editedFile(query.file as string)
                .then((r) => r.url)
            : API.files
                .downloadFile(query.file as string)
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
  },[
    file,
    query,
  ]);

  useEffect(() => {
    if(!file){
        return;
    }
  
    loadPdfCover();
  }, [loadPdfCover, file]);

  return useMemo(() => ({imagePDF, isImageLoading}), [imagePDF, isImageLoading]);
}