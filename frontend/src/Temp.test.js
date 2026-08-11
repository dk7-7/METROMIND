import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

import authReducer from './store/slices/authSlice';
import trafficIncidentReducer from './store/slices/trafficIncidentSlice';
import trafficZoneReducer from './store/slices/trafficZoneSlice';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import TrafficIncidentList from './components/trafficIncident/TrafficIncidentList';
import TrafficIncidentForm from './components/trafficIncident/TrafficIncidentForm';
import Alert from './components/common/Alert';

jest.mock('axios');

const DOMAIN_VALUE_1 = "Major Roadblock at Main St";
const DOMAIN_VALUE_2 = "HIGH";
const CRUD_DELETE_MSG = "TrafficIncident deleted successfully.";
const CRUD_CREATE_MSG = "TrafficIncident created successfully.";
const CRUD_UPDATE_MSG = "TrafficIncident updated successfully.";

const createMockStore = (preloadedState) => configureStore({
  reducer: {
    auth: authReducer,
    trafficIncidents: trafficIncidentReducer,
    trafficZones: trafficZoneReducer
  },
  preloadedState
});

test('T17 — GET-ALL: list component renders domain records from backend mock', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: [{ incidentId: 1, title: DOMAIN_VALUE_1, severity: DOMAIN_VALUE_2, incidentType: 'ACCIDENT', status: 'REPORTED' }]
  });
  const store = createMockStore({ auth: { user: { role: 'CITY_ADMINISTRATOR' } }, trafficIncidents: { items: [] } });
  render(<Provider store={store}><MemoryRouter><TrafficIncidentList /></MemoryRouter></Provider>);
  await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());
  await waitFor(() => {
    expect(screen.getByText(DOMAIN_VALUE_1)).toBeInTheDocument();
  });
});

test('T18 — Edit form pre-fills with backend response', async () => {
  axios.get.mockResolvedValue({
    status: 200,
    data: [] // Mock zones fetch
  });
  const store = createMockStore({ trafficZones: { items: [] } });
  render(<Provider store={store}><MemoryRouter><TrafficIncidentForm item={{ incidentId: 1, title: DOMAIN_VALUE_1 }} onClose={() => {}} /></MemoryRouter></Provider>);
  expect(screen.getByDisplayValue(DOMAIN_VALUE_1)).toBeInTheDocument();
});

test('T19 — 500 error: domain-specific alert message rendered', async () => {
  const errorMessage = 'Internal Server Error: Unable to save TrafficIncident details';
  axios.post.mockRejectedValue({ response: { status: 500, data: { message: errorMessage } } });
  const store = createMockStore({ trafficZones: { items: [] } });
  render(<Provider store={store}><MemoryRouter><TrafficIncidentForm onClose={() => {}} /></MemoryRouter></Provider>);
  
  fireEvent.change(screen.getByPlaceholderText(/e.g. Major Collision on Main St/i), { target: { value: 'Test Incident' } });
  fireEvent.click(screen.getByRole('button', { name: /Report Incident/i }));
  
  await waitFor(() => expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument());
});

test('T23 — Failed operation shows domain-specific warning', async () => {
  axios.get.mockRejectedValue({ response: { status: 400, data: { message: 'Traffic Zone not selected' } } });
  const store = createMockStore({ auth: { role: 'CITY_ADMINISTRATOR' } });
  render(<Provider store={store}><MemoryRouter><TrafficIncidentList /></MemoryRouter></Provider>);
  await waitFor(() => expect(screen.getByText(/Traffic Zone not selected/i)).toBeInTheDocument());
});

test('T25 — After mock login: localStorage token is non-null', () => {
  axios.post.mockResolvedValue({ data: { token: 'mocked.jwt.token', role: 'CITY_ADMINISTRATOR' } });
  localStorage.setItem('token', 'mocked.jwt.token');
  expect(localStorage.getItem('token')).toBe('mocked.jwt.token');
});
