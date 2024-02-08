import { fileService, planimetrieService } from '@/services/resources';
import { Err } from '@/types';
import { Job } from '@/types/planimetrie';
import { faDownload, faFileUpload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, LinearProgress, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingOver from './loadingOver';
const LinearProgressWithLabel = ({ value }: { value: number }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

type Props = {
  onFileChange?: (job: Job) => void;
  multiple?: boolean;
  job: Job | null;
};

const FileDropzone = ({ multiple = false, job: initJob, onFileChange }: Props) => {
  const [job, setJob] = useState<Job | null>(initJob);
  const [files, setFiles] = useState<{ files: File[]; error?: boolean }>();
  const [progress, setProgress] = useState<number>(0);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = Array.from(e.target.files!);
    if (selectedFile && job) {
      setFiles({ files: selectedFile });
      fileService
        .uploadFile(selectedFile, job.id, (p) => onProgress(p))
        .then(() => {
          handleFile();
          setFiles(undefined);
        })
        .catch((e: Err) => {
          toast.error(e.messaggioErrore);
          console.error(e);
          setFiles({ files: selectedFile, error: true });
        });
    }
  };

  const onProgress = (p: number) => {
    setProgress(p);
  };
  const handleFile = () => {
    if (input.current) input.current.value = '';
    if (job?.id) {
      setFileLoading(true);
      planimetrieService
        .getPlanimetriaDetails(job.id)
        .then((j) => setJob(j.result[0]))
        .finally(() => setFileLoading(false));
    }
  };

  const handleFileDownload = (id: number) => {
    setFileLoading(true);
    fileService
      .downloadFile(id)
      .then((f) => window.open(f.url, '_blank'))
      .catch((e: Err) => toast.error(e.messaggioErrore))
      .finally(() => setFileLoading(false));
  };
  const handleFileRemove = (id: number, api: boolean = false) => {
    if (api) {
      setFileLoading(true);
      fileService
        .removeFile(id)
        .then(() => handleFile())
        .catch((e: Err) => toast.error(e.messaggioErrore))
        .finally(() => setFileLoading(false));
    } else {
      setFiles({ files: files?.files.filter((_f, index) => index !== id) || [], error: files?.error });
      handleFile();
    }
  };
  useEffect(() => {
    if (job) onFileChange && onFileChange(job);
  }, [job]);
  return (
    <div className={classNames('flex flex-col justify-center w-full')}>
      {fileLoading && <LoadingOver />}
      <label className="flex flex-col justify-center w-full min-h-64 border-2  border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col grow gap-1 p-2 relative m-1">
          <div className="flex flex-wrap grow gap-1 relative m-1">
            <div className="grid  grid-cols-5 gap-1">
              {job?.attachments
                ?.filter((a) => !a.deleted_on)
                .map((a) => (
                  <div className=" bg-slate-200 rounded-md flex flex-col max-w-full p-1" key={a.id}>
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="self-end  p-2 hover:bg-slate-100 rounded-full z-40 "
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFileDownload(a.id);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="self-end  p-2 hover:bg-slate-100 rounded-full z-40 "
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFileRemove(a.id, true);
                        }}
                      />
                    </div>
                    <span className="self-center  warp">{a.filename}</span>
                  </div>
                ))}
              {files?.files?.map((file, idx) => {
                return (
                  <div key={idx} className={classNames(' bg-slate-200 rounded ', { 'bg-red-300': files.error })}>
                    <div className="flex justify-end">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="self-end m-5 p-2 hover:bg-slate-100 rounded-full z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFileRemove(idx);
                        }}
                      />
                    </div>
                    <span className="self-center">{file.name}</span>
                    {progress && <LinearProgressWithLabel value={progress} />}
                  </div>
                );
              })}
            </div>
            {(multiple || job?.attachments?.length == 0 || !job?.attachments) && (
              <div className="w-full py-4 flex gap-1 flex-col items-center justify-center">
                <FontAwesomeIcon icon={faFileUpload} className="text-2xl" />
                <span>Aggiungere i file</span>
                <input
                  ref={input}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple={multiple}
                />
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileDropzone;
