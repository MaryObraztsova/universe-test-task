import { InternalFileType } from '../../shared/types';

export const interactorImagesFormat = [
  InternalFileType.HEIC,
  InternalFileType.SVG,
  InternalFileType.PNG,
  InternalFileType.BMP,
  InternalFileType.EPS,
  InternalFileType.GIF,
  InternalFileType.TIFF,
  InternalFileType.WEBP,
  InternalFileType.JPG,
  InternalFileType.JPEG,
] as const satisfies InternalFileType[];

