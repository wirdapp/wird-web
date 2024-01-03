import { useLayoutContext } from "../layout/DashboardLayout";

export const usePageTitle = (title) => {
  const { setPageTitle } = useLayoutContext();

  setPageTitle(title);
};
