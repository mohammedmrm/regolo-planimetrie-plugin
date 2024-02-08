import { User } from '@/services/auth';
import { authService } from '@/services/resources';
import { Filter } from '@/types';
import { Job, PLANIMETRIA } from '@/types/planimetrie';
import classNames from 'classnames';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlanimetrieTableHead from './planimetrieTableHead';
export interface Props {
  loading?: boolean;
  planimetrie: Job[] | null | undefined;
  startWorking?: (jobId: number) => void;
  onRefresh?: () => void;
  onFilter?: (getValues: Filter) => void;
}
export const PlanimetriaTable: React.FC<Props> = ({ planimetrie, loading, startWorking, onRefresh, onFilter }) => {
  return (
    <>
      <div
        className={`${
          loading ? ' opacity-70 ' : ''
        } relative flex flex-col min-w-0 break-words w-full   rounded bg-white dark:bg-slate-800 gap-y-2`}
      >
        <PlanimetrieTableHead onRefresh={onRefresh} loading={loading} onFilter={onFilter} />
        <div className="block w-full overflow-x-auto">
          <table
            className={`${loading && 'opacity-60 '} items-center w-full bg-transparent border-collapse`}
            id="reportsTable"
          >
            <thead className="mb-1">
              <tr className="text-left font-extrabold  bg-slate-200 text-slate-700 dark:text-slate-50 dark:bg-slate-700 ">
                <th className="px-3 align-middle   py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap   ">
                  Richiedente
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Comune
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  state
                </th>
                <th className="px-3 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Foglio
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Particella
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Subalterno
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Sezione Urbana
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Data richiesta
                </th>
                <th className="px-3 align-middle  py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {planimetrie?.map((planimetria: Job, i: number) => {
                return <PlanimetriaRow key={i} job={planimetria} startWorking={startWorking} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
type RawProps = {
  job: Job;
  startWorking?: (jobId: number) => void;
};
export function PlanimetriaRow({ job, startWorking }: RawProps) {
  const planimetria = job.incoming as PLANIMETRIA;
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const l = locales as { [x: string]: locales.Locale };
  const date = format(new Date(planimetria.data_richiesta), 'PP', {
    locale: language ? l[language] : l['enUS'],
  });
  const [assignAvailable, setAssignAvailable] = useState<'error' | boolean | null>(null);
  const check = () =>
    authService
      .resolveLoggedUser()
      .then((loggedUser: User) => {
        setAssignAvailable(loggedUser.user.id === job.assignee?.id);
      })
      .catch((e) => {
        console.log(e);
        setAssignAvailable('error');
      });
  useEffect(() => {
    check();
  }, []);
  const state: string = job.state;
  return (
    <tr
      className={classNames('my-3 dark:bg-slate-900 h-14 border-b-2 ', {
        'odd:bg-gray-100': job.outgoing?.successful === undefined,
        'bg-green-100': job.outgoing?.successful === true,
        'bg-red-100': job.outgoing?.successful === false,
      })}
    >
      <th className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left  items-center">
        {planimetria.richiedente}
      </th>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        {planimetria.comune.nome}
      </td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        <i className={`fa fa-circle state-color-${state} mr-2`} />
        {t(`jobs.states.${state}`)}
      </td>

      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        {planimetria.foglio}
      </td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        {planimetria.particella}
      </td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        {planimetria.subalterno}
      </td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
        {planimetria.sezione_urbana}
      </td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">{date}</td>
      <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap   text-right">
        {state == 'u' && (
          <button
            className="font-bold bg-blue-500 text-white active:bg-blue-600 
                       uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none 
                       focus:outline-none mr-1 ease-linear transition-all duration-150"
            onClick={() => {
              startWorking && startWorking(job.id);
            }}
          >
            {t('jobs.botton.work')}
          </button>
        )}
        {state == 'a' && assignAvailable === null && <span>checking...</span>}
        {state == 'a' && assignAvailable === 'error' && 'Error'}
        {(state == 'a' || state === 's') && assignAvailable === true && (
          <button
            className="font-bold bg-green-500 text-white active:bg-green-600 
                       uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none 
                       focus:outline-none mr-1 ease-linear transition-all duration-150"
            onClick={() => {
              startWorking && startWorking(job.id);
            }}
          >
            {t('jobs.botton.resume')}
          </button>
        )}
      </td>
    </tr>
  );
}
