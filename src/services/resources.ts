import { AuthService } from '@/services/auth';
import { ReportsService } from '@/services/reports';
import { FileService } from './fileService';
import { HttpClient } from './httpClient';
import { PlanimetrieService } from './planimetrieService';

const baseUrl = import.meta.env.VITE_API_URL;
const httpClient = new HttpClient(baseUrl);

const authService = new AuthService(httpClient);
const reportsService = new ReportsService(httpClient);
const planimetrieService = new PlanimetrieService(httpClient);
const fileService = new FileService(httpClient);

// we cannot initialize plugins here because in dev mode
// nextjs has ssr enabled
// window.plugins = setupPluginInterface(reportsService);

export { authService, fileService, planimetrieService, reportsService };
