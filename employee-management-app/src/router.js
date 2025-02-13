import { Router } from '@vaadin/router';
import './employee-list.js';
import './employee-form.js';

// Ensure the outlet exists in the DOM
let outlet = document.getElementById('outlet');
if (!outlet) {
  outlet = document.createElement('div');
  outlet.id = 'outlet';
  document.body.appendChild(outlet);
}

// Initialize the router
const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'employee-list' },
  { path: '/employees', component: 'employee-list' },
  { path: '/add', component: 'employee-form' },
  { path: '/edit/:id', component: 'employee-form' },
  { path: '(.*)', redirect: '/' } // Redirect unknown paths
]);

export default router;
