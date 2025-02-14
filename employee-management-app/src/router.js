import { Router } from '@vaadin/router';
import './employee-list.js';
import './employee-form.js';

let outlet = document.getElementById('outlet');

if (!outlet) {
  outlet = document.createElement('div');
  outlet.id = 'outlet';
  document.body.appendChild(outlet);
}

const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'employee-list' },
  { path: '/employees', component: 'employee-list' },
  { path: '/add', component: 'employee-form' },
  { path: '/employees/page/:pageNumber', component: 'employee-list' },
  { path: '/edit/:id', component: 'employee-form' },
  { path: '(.*)', redirect: '/' } 
]);

export default router;
