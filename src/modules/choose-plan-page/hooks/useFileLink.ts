import { useCallback, useEffect, useState } from 'react';
import { FileLinkHook } from '../interactor.types';
import { InternalFileType } from '../../../shared/types';
import { useRouter } from 'next/router';
import { API } from '../../../services/api';

export const useFileLink: FileLinkHook = ({file,imagesFormat}) => {
  const [fileLink, setFileLink] = useState<string | null>(null);
  const {query} = useRouter();

  const loadImageCover = useCallback(async () => {
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
      if (query?.file) {
        return query.editedFile === "true"
          ? API.files.editedFile(query.file as string).then((r) => r.url)
          : API.files
              .downloadFile(query.file as string)
              .then((r) => r.url);
      }

      return API.files.downloadFile(file.id).then((r) => r.url);
    })();

    setFileLink(fileUrl);
  },[
    file,
    query,
    imagesFormat,
  ])

  useEffect(() => {
    loadImageCover();
  }, [loadImageCover]);

  return {
    fileLink
  }
}