import { createContext, useContext, useMemo } from "react";
import { useContestSections } from "./use-contest-sections";
import { useContestCriteria } from "./use-contest-criteria";

const ContestCriteriaContext = createContext({
  sections: {
    items: [],
    setItems: () => {},
    add: () => {},
    update: () => {},
    remove: () => {},
    loading: false,
  },
  criteria: {
    items: [],
    setItems: () => {},
    add: () => {},
    update: () => {},
    remove: () => {},
    loading: false,
  },
  loading: false,
});

export const useContestCriteriaContext = () =>
  useContext(ContestCriteriaContext);

export const ContestCriteriaProvider = ({ children }) => {
  const sections = useContestSections();
  const criteria = useContestCriteria();

  const contextValue = useMemo(
    () => ({
      sections,
      criteria,
      loading: sections.loading || criteria.loading,
    }),
    [sections, criteria],
  );

  return (
    <ContestCriteriaContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </ContestCriteriaContext.Provider>
  );
};
