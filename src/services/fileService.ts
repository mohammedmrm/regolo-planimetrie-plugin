import { DOWNLOAD_FILE, EMPTY_OBJECT } from '@/types/planimetrie';
import { HttpClient } from './httpClient';

export class FileService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  uploadFile(file: File | File[], job_id: number, onProgress?: (progress: number) => void) {
    const _url = `backoffice_san_regolo/upload`;

    const formData = new FormData();

    if (file instanceof File) {
      formData.append('file', file);
    } else if (Array.isArray(file)) {
      file.forEach((fileItem, index) => {
        formData.append(`file[${index}]`, fileItem);
      });
    }

    formData.append('job_id', String(job_id));

    return this.http.postWithFileUpload(_url, formData, EMPTY_OBJECT, onProgress);
  }

  downloadFile(file_id: number): Promise<DOWNLOAD_FILE> {
    const _url = `backoffice_san_regolo/download`;
    return this.http.post(_url, { attachment_id: file_id }, DOWNLOAD_FILE);
  }
  removeFile(file_id: number): Promise<EMPTY_OBJECT> {
    const _url = `backoffice_san_regolo/remove_attachment`;
    return this.http.post(_url, { attachment_id: file_id }, EMPTY_OBJECT);
  }
}
