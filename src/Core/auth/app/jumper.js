import { useDataPreloader } from "../../initialLoad/app/jumper";

export const useSync = () => ({ shouldSync: useDataPreloader().shouldSync });
