import { Filter } from "@/types";
import { faArrowsRotate, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface props {
  onRefresh?: () => void;
  onFilter?: (getValues: Filter) => void;
  loading?: boolean;
}

export default function PlanimetrieTableHead({
  onRefresh,
  loading,
  onFilter,
}: props) {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [strico, setStrico] = useState<boolean>(false);
  const { t } = useTranslation();
  const {
    register,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm<Filter>({});
  const handleHostiry = () => {
    setStrico(!strico);
  };
  useEffect(() => {
    onFilter &&
      onFilter({
        ...getValues(),
        states: strico ? ["c", "d"] : ["a", "u", "s"],
      });
  }, [strico]);
  return (
    <div className="flex grow rounded-t mb-0  border-0">
      <div className="w-full">
        <div className="relative w-full  flex justify-between">
          <h3 className={"font-semibold text-3xl text-gray-700"}>
            {t("dashboard.title")}
          </h3>
          <div className="flex gap-x-4">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mr-4  text-gray-700 hover:bg-gray-100 p-2"
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className={loading ? "animate-spin opacity-70" : ""}
                />
              </button>
            )}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`${
                showFilter && "bg-slate-200"
              } text-gray-700 hover:bg-gray-100 p-2`}
            >
              <FontAwesomeIcon
                icon={faFilter}
                className={` text-[20px] fa-sharp fa-solid fa-${
                  showFilter ? "x" : "filter"
                }`}
              />
            </button>
            <Button onClick={handleHostiry} variant="contained">
              {strico ? "Nuove richieste" : "Strico"}
            </Button>
          </div>
        </div>
        {
          //TODO: use i18n from fields name and labels
        }
        {showFilter && (
          <form className="w-full">
            <div className="w-full flex flex-col md:flex-row flex-wrap gap-2 bg-slate-200 py-4 px-2 rounded">
              <div className="md:w-2/6 w-full flex flex-col md:flex-row  gap-2 mx-1">
                <div className="md:w-1/2 flex flex-col">
                  <label>{t("jobs.filter.created_from")}</label>
                  <input
                    {...register("created_from")}
                    type="datetime-local"
                    className="border-b-2 border-gray-800 h-10 bg-slate-50 px-2 focus:border-none"
                    placeholder={t("jobs.filter.created_from")}
                  />
                </div>
                <div className="md:w-1/2 flex flex-col">
                  <label>{t("jobs.filter.created_to")}</label>
                  <input
                    {...register("created_to")}
                    type="datetime-local"
                    className="border-b-2 border-gray-800 h-10 bg-slate-50 px-2 focus:border-none"
                    placeholder={t("jobs.filter.created_to")}
                  />
                </div>
              </div>
              <div className="md:w-2/6 w-full  flex flex-col md:flex-row  gap-2 mx-1">
                <div className="md:w-1/2 flex flex-col">
                  <label>{t("jobs.filter.assigned_from")}</label>
                  <input
                    type="datetime-local"
                    {...register("assigned_from")}
                    className="border-b-2 border-gray-800 h-10 bg-slate-50 px-2 focus:border-none"
                    placeholder={t("jobs.filter.assigned_from")}
                  />
                </div>
                <div className="md:w-1/2 flex flex-col">
                  <label>{t("jobs.filter.assigned_to")}</label>
                  <input
                    type="datetime-local"
                    {...register("assigned_to")}
                    className="border-b-2 border-gray-800 h-10 bg-slate-50 px-2 focus:border-none"
                    placeholder={t("jobs.filter.assigned_to")}
                  />
                </div>
              </div>
              <div className="md:w-1/6 grid place-items-center  flex-col mx-1">
                <div className="w-full flex flex-col">
                  <label> {t("jobs.filter.assigned")}</label>
                  <select
                    className="border-b-2 border-gray-800 h-10 bg-slate-50 px-2 focus:border-none"
                    {...register("assigned", {
                      onChange: (e) => {
                        console.log(e);
                      },
                      setValueAs: (e) =>
                        e === "all"
                          ? undefined
                          : e === "assigned"
                          ? true
                          : false,
                    })}
                    defaultValue={"all"}
                  >
                    <option value={"all"}>All</option>
                    <option value={"assigned"}>assigned</option>
                    <option value={"unassigned"}>unassigned</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 my-auto grow place-content-end">
                <button
                  type="button"
                  className="bg-yellow-700 text-white px-4 h-10 rounded shadow opacity-75 hover:opacity-100 disabled:opacity-50"
                  disabled={!isDirty}
                  onClick={(e) => {
                    e.preventDefault();
                    reset();
                    onFilter && onFilter({});
                  }}
                >
                  {t("jobs.filter.clear")}
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 h-10 rounded shadow opacity-75 hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    onFilter && onFilter(getValues());
                  }}
                >
                  {t("jobs.filter.search")}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
