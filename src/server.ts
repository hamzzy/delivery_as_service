import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import CustomerRoute from './routes/customer.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new CustomerRoute()]);

app.listen();
