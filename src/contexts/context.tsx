import React, {
  Dispatch,
  SetStateAction,
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Err } from "@/types";

import { error_GD00401 } from "@/utils/errors";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next, useTranslation } from "react-i18next";
import { toast } from "react-toastify";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    backend: {
      loadPath: import.meta.env.BASE_URL + "/locales/{{lng}}.json",
    },
    ns: "common",
    react: {
      useSuspense: true,
    },
    supportedLngs: ["en", "it"],
    fallbackLng: "it",
    interpolation: {
      escapeValue: true,
    },
  });

const MainContext = createContext({
  i18n: i18n,
  loading: false,
  setMainLoading: {} as Dispatch<SetStateAction<boolean>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setlng: (language: string) => {},
  isExpired: false,
  setExpired: {} as Dispatch<SetStateAction<boolean>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  errorHandler: (e: Err) => {},
});

export default function reducer(loading: boolean) {
  return loading;
}

interface Props {
  children: React.ReactNode;
}

export const MainProvider: React.FC<Props> = ({ children }) => {
  const [isExpired, setExpired] = useState(false);
  const [loading, setMainLoading] = useState(false);
  const { t } = useTranslation();

  /** * To be called on catch to show toast or session expired Modal @Prama Err @type(Err) @return Toast*/
  const errorHandler = useCallback(
    (e: Err) => {
      if (e.codiceErrore === error_GD00401) {
        setExpired(true);
      } else {
        toast.error(t(`errors.${e.codiceErrore}`) || e.messaggioErrore);
      }
    },
    [t]
  );

  const supportedLocales = useRef(["it", "en"]);
  const setlng = (lng: string) => {
    if (supportedLocales.current.includes(lng)) {
      i18n.changeLanguage(lng);
    }
  };

  useEffect(() => {
    const l = navigator.language.slice(0, 2); // this pice of code use the get browser lang without use for extar lib
    if (supportedLocales.current.includes(l)) {
      // i18n.changeLanguage(l);
    }
  }, []);

  return (
    <Suspense>
      <MainContext.Provider
        value={{
          loading,
          i18n,
          setlng,
          setMainLoading,
          isExpired,
          setExpired,
          errorHandler,
        }}
      >
        {children}
      </MainContext.Provider>
    </Suspense>
  );
};

export function useMainContext() {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("useMainContext must be used within MainProvider");
  }

  return context;
}
