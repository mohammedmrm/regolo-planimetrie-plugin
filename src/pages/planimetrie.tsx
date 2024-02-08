/* eslint-disable @typescript-eslint/ban-ts-comment */
import Error from '@/components/common/error';
import FileDropzone from '@/components/common/fileDropzone';
import Loading from '@/components/common/loading';
import LoadingOver from '@/components/common/loadingOver';
import { useRefState } from '@/hooks/useRefState';

import { PluginInterface, pluginInterface } from '@/services/plugins';
import { Err } from '@/types';
import { Job, PLANIMETRIA, PLANIMETRIA_POST_REQUEST, PLANIMETRIA_SCHEMA } from '@/types/planimetrie';
import { error_GD1000, error_GD1002 } from '@/utils/errors';
import {
  faCity,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileDownload,
  faLocation,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const Planimetrie = () => {
  const [data, setData] = useState<PLANIMETRIA>();
  const [comment, setComment] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<Err>();
  const regoloInterface = useRef<PluginInterface>();
  const [job, setJob] = useRefState<Job | null>(null);
  const jobCompleteLock = useRef(false);

  const initJob = (job: Job) => {
    setJob(job);
    console.log(job);
    if (PLANIMETRIA_SCHEMA.safeParse(job.incoming).success) {
      setData(job.incoming);
    } else {
      console.error('the received data does not satisfy the expected data', job);
      const error: Err = {
        messaggioErrore: 'I dati ricevuti non soddisfano i dati attesi',
        codiceErrore: 'GD00314',
      };
      setErrorReport(error);
    }
  };

  const jobCompleted = (job: Job | null | undefined, data: PLANIMETRIA_POST_REQUEST | Err) => {
    if (!job) {
      console.error('jobComplete called twice while the previous one is still running (maybe)');
      return;
    }

    if (jobCompleteLock.current) return;

    jobCompleteLock.current = true;
    setLoading(true);
    regoloInterface.current
      ?.jobComplete(job?.id, data)
      .then((newJob) => {
        initJob(newJob);
      })
      .catch((e) => {
        if ([error_GD1000, error_GD1002].includes(e.messaggioErrore)) setJob(null);
        console.warn('Plugin disposed', e);
      })
      .finally(() => {
        setLoading(false);
        jobCompleteLock.current = false;
      });
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  useEffect(() => {
    regoloInterface.current = pluginInterface();
    pluginInterface()
      .currentJob()
      .then((j) => {
        initJob(j);
      })
      .catch((e) => {
        console.error('job redeeming failed', e);
      });
  }, []);
  const handleSubmit = (successful: boolean) => {
    jobCompleted(job.current, {
      user_message: comment,
      successful,
    });
  };
  if (errorReport)
    return (
      <div className="h-screen">
        {loading && <LoadingOver />}
        <Error error={errorReport} retryLabel="Report" onRetry={() => jobCompleted(job.current, errorReport)} />
      </div>
    );
  if (!data || loading) return <Loading />;
  return (
    <div className="h-screen bg-white rounded flex flex-col text-gray-700">
      <h2 className="text-xl text-gray-700 p-4 font-bold shadow">Dettaglio Planimetria</h2>
      <div className="flex grow overflow-auto">
        <div className="shadow  flex grow flex-col px-8 ">
          <div className="border-t-2 border-gray-200 py-2">
            <span className="font-light text-gray-500 ">Richiedente:</span>
            <div className="flex place-items-center gap-3">
              <FontAwesomeIcon icon={faUserAlt} className="text-xl" />
              <div>
                <div>
                  <span className="font-extrabold">Richiedente: </span>
                  <span>{data.richiedente}</span>
                </div>
                <div>
                  <span className="font-extrabold">Partita IVA rich.: </span>
                  <span>{data.cf_piva_richiedente}G</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-200 py-2">
            <span className="font-light text-gray-500 ">Info:</span>
            <div className="flex gap-y-6 flex-col">
              <div className="flex place-items-center gap-3">
                <FontAwesomeIcon icon={faLocation} className="text-xl" />
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-extrabold">Comune: </span>
                    <span>{data.comune.nome}</span>
                  </div>
                  <div>
                    <span className="font-extrabold">Codice catastale: </span>
                    <span>{data.comune.codice_catastale}</span>
                  </div>
                  <div>
                    <span className="font-extrabold">Provincia: </span>
                    <span>
                      {data.provincia.nome} ({data.provincia.sigla})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex place-items-center gap-3">
                <FontAwesomeIcon icon={faFile} className="text-xl" />
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-extrabold">Foglio: </span>
                    <span>{data.foglio}</span>
                  </div>
                </div>
              </div>
              <div className="flex place-items-center gap-3">
                <FontAwesomeIcon icon={faFileArchive} className="text-xl" />
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-extrabold">Particella: </span>
                    <span>{data.particella}</span>
                  </div>
                </div>
              </div>
              <div className="flex place-items-center gap-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-extrabold">Subalterno: </span>
                    <span>{data.subalterno}</span>
                  </div>
                </div>
              </div>
              <div className="flex place-items-center gap-3">
                <FontAwesomeIcon icon={faCity} className="text-xl" />
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-extrabold">Sezione urbana: </span>
                    <span>{data.sezione_urbana}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-200 py-2">
            <span className="font-light text-gray-500 ">Documenti:</span>
            <div className="flex flex-col gap-2">
              <a href={data.url_documento_ident} target="_blank">
                <div className="flex place-items-center gap-3">
                  <FontAwesomeIcon icon={faFileDownload} className="text-xl" />
                  <div>
                    <div>
                      <span className="font-extrabold">Documento identificativo:</span>
                      <span className="p-2">Visualizza </span>
                    </div>
                  </div>
                </div>
              </a>
              <a href={data.url_delega} target="_blank">
                <div className="flex place-items-center gap-3">
                  <FontAwesomeIcon icon={faFileDownload} className="text-xl" />
                  <div>
                    <div>
                      <span className="font-extrabold">Documento delega: </span>
                      <span className="p-2">Visualizza </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {data.stato === 'aperta' && (
          <div className="rounded-sm w-4/6 flex flex-col grow">
            <div className="flex flex-col gap-5 grow p-4">
              <FileDropzone job={job.current} multiple onFileChange={(job) => setJob(job)} />
              <div className="flex flex-col">
                <span>Note: </span>
                <textarea
                  onChange={handleCommentChange}
                  placeholder="Lascia un commento"
                  className="border-b-2 bg-gray-100 p-2 rounded outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex justify-end m-4 gap-4">
              <Button variant="contained" color="error" onClick={() => handleSubmit(false)} disabled={!comment}>
                Planimetrie inevadible
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit(true)}
                disabled={job.current?.attachments?.filter((a) => !a.deleted_on).length == 0}
              >
                Evadi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Planimetrie;
