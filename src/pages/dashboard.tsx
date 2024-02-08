import Error from "@/components/common/error";
import { PlanimetriaTable } from "@/components/planimetrieTable";
import Layout from "@/layout/Layout";
import { PluginInterface, pluginInterface } from "@/services/plugins";
import { planimetrieService } from "@/services/resources";
import { Err, Filter, Paginate } from "@/types";
import { PLANIMETRIE_RESPONSE } from "@/types/planimetrie";
import { PAGINATION } from "@/utils/const";
import { Pagination } from "@mui/material";
import { FunctionComponent, useEffect, useRef, useState } from "react";

interface Props {}

const Dashboard: FunctionComponent<Props> = () => {
  const [jobs, setJobs] = useState<PLANIMETRIE_RESPONSE>();
  const [error, setError] = useState<Err>();
  const [loading, setLoading] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const regoloInterface = useRef<PluginInterface>();
  const pagination = useRef<Paginate>({
    from_index: 0,
    to_index: PAGINATION.LIMIT,
  });
  const filter = useRef<Filter>();

  const loadPlanimetrie = () => {
    setLoading(true);
    planimetrieService
      .getPlanimetrie({ ...filter.current, ...pagination.current })
      .then((jobs) => {
        setJobs(jobs);
      })
      .catch((e) => {
        console.log(e);
        setError({ codiceErrore: "GD0500", messaggioErrore: "error" });
      })
      .finally(() => setLoading(false));
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (value !== currentPage) {
      setCurrentPage(value);
      pagination.current = {
        from_index: (value - 1) * PAGINATION.LIMIT,
        to_index: value * PAGINATION.LIMIT,
      };
      loadPlanimetrie();
    }
  };
  useEffect(() => {
    regoloInterface.current = pluginInterface();
    loadPlanimetrie();
  }, []);

  const handleRowClick = (id: number) => {
    regoloInterface.current?.startWorking &&
      regoloInterface.current?.startWorking(id);
  };
  if (error) return <Error error={error} />;
  return (
    <Layout>
      <div className="p-10 h-full flex flex-col gap-4 grow justify-between">
        <PlanimetriaTable
          onRefresh={() => {
            pagination.current = {
              from_index: 0,
              to_index: PAGINATION.LIMIT,
            };
            loadPlanimetrie();
            setCurrentPage(1);
          }}
          onFilter={(e: Filter) => {
            filter.current = e;
            pagination.current = {
              from_index: 0,
              to_index: PAGINATION.LIMIT,
            };
            loadPlanimetrie();
            setCurrentPage(1);
          }}
          planimetrie={jobs?.result}
          startWorking={handleRowClick}
          loading={loading}
        />
        <Pagination
          count={Math.ceil((jobs?.total || 1) / PAGINATION.LIMIT)}
          className="my-1 py-2 w-full shadow bg-white justify-center flex"
          onChange={handlePageChange}
          page={currentPage}
          color="primary"
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
