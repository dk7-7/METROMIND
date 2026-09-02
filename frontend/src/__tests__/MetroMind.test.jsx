import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import trafficIncidentReducer from '../store/slices/trafficIncidentSlice';
import trafficZoneReducer from '../store/slices/trafficZoneSlice';
import utilityGridReducer from '../store/slices/utilityGridSlice';
import utilityOutageReducer from '../store/slices/utilityOutageSlice';
import fieldObservationReducer from '../store/slices/fieldObservationSlice';
import alertNotificationReducer from '../store/slices/alertNotificationSlice';

import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Navbar from '../components/layout/Navbar';
import CapacityBar from '../components/common/CapacityBar';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ErrorHandler from '../components/common/ErrorHandler';
import SearchFilterBar from '../components/common/SearchFilterBar';
import Alert from '../components/common/Alert';
import StatCards from '../components/dashboard/StatCards';
import IncidentStatusDonut from '../components/dashboard/IncidentStatusDonut';
import RecentActivity from '../components/dashboard/RecentActivity';
import NotificationStack from '../components/NotificationStack';
import TrafficIncidentList from '../components/trafficIncident/TrafficIncidentList';
import TrafficIncidentForm from '../components/trafficIncident/TrafficIncidentForm';
import UtilityGridList from '../components/utilityGrid/UtilityGridList';
import UtilityOutageList from '../components/utilityOutage/UtilityOutageList';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      trafficIncident: trafficIncidentReducer,
      trafficZone: trafficZoneReducer,
      utilityGrid: utilityGridReducer,
      utilityOutage: utilityOutageReducer,
      fieldObservation: fieldObservationReducer,
      alertNotification: alertNotificationReducer,
    },
    preloadedState,
  });
};

const renderWithProviders = (ui, { preloadedState = {}, store = createTestStore(preloadedState) } = {}) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('MetroMind Frontend Test Suite', () => {
  describe('Authentication Components', () => {
    test('Login component renders required inputs and buttons', () => {
      renderWithProviders(<Login />);
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('Login shows Authenticating... while loading', () => {
      renderWithProviders(<Login />, {
        preloadedState: {
          auth: { loading: true, user: null, isAuthenticated: false, error: null },
        },
      });
      expect(screen.getByRole('button', { name: /Authenticating.../i })).toBeDisabled();
    });

    test('Login renders error-alert when authentication fails', () => {
      const { container } = renderWithProviders(<Login />, {
        preloadedState: {
          auth: { loading: false, user: null, isAuthenticated: false, error: 'Invalid credentials' },
        },
      });
      const errorDiv = container.querySelector('.error-alert');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveTextContent('Invalid credentials');
    });

    test('Register component renders required fields and roles', () => {
      renderWithProviders(<Register />);
      expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Choose a password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();

      expect(screen.getByText('CITY_ADMINISTRATOR')).toBeInTheDocument();
      expect(screen.getByText('TRAFFIC_CONTROLLER')).toBeInTheDocument();
      expect(screen.getByText('UTILITY_SUPERVISOR')).toBeInTheDocument();
      expect(screen.getByText('FIELD_TECHNICIAN')).toBeInTheDocument();
    });
  });

  describe('Navbar Component', () => {
    test('renders brand MetroMind linking to root and unauthenticated links', () => {
      renderWithProviders(<Navbar />, {
        preloadedState: {
          auth: { user: null, isAuthenticated: false },
        },
      });
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('MetroMind')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    test('renders CITY_ADMINISTRATOR navigation links', () => {
      renderWithProviders(<Navbar />, {
        preloadedState: {
          auth: {
            user: { username: 'admin', role: 'CITY_ADMINISTRATOR' },
            isAuthenticated: true,
          },
        },
      });
      expect(screen.getByText('Incidents')).toBeInTheDocument();
      expect(screen.getByText('Utility Grids')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Official Registry')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('renders TRAFFIC_CONTROLLER navigation links', () => {
      renderWithProviders(<Navbar />, {
        preloadedState: {
          auth: {
            user: { username: 'controller', role: 'TRAFFIC_CONTROLLER' },
            isAuthenticated: true,
          },
        },
      });
      expect(screen.getByText('Incidents')).toBeInTheDocument();
      expect(screen.getByText('Traffic Zones')).toBeInTheDocument();
    });

    test('renders UTILITY_SUPERVISOR navigation links', () => {
      renderWithProviders(<Navbar />, {
        preloadedState: {
          auth: {
            user: { username: 'supervisor', role: 'UTILITY_SUPERVISOR' },
            isAuthenticated: true,
          },
        },
      });
      expect(screen.getByText('Utility Grids')).toBeInTheDocument();
      expect(screen.getByText('Outages')).toBeInTheDocument();
    });
  });

  describe('Common Components', () => {
    test('CapacityBar calculates percentage and renders progress bar correctly', () => {
      const { container, rerender } = render(<CapacityBar current={50} total={100} />);
      let fill = container.querySelector('.capacity-bar-fill');
      expect(fill).toHaveStyle('background-color: #22c55e');

      rerender(<CapacityBar current={75} total={100} />);
      fill = container.querySelector('.capacity-bar-fill');
      expect(fill).toHaveStyle('background-color: #f59e0b');

      rerender(<CapacityBar current={95} total={100} />);
      fill = container.querySelector('.capacity-bar-fill');
      expect(fill).toHaveStyle('background-color: #ef4444');
    });

    test('Pagination renders Previous/Next and page info', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination
          totalItems={20}
          itemsPerPage={5}
          currentPage={1}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('Previous')).toBeDisabled();
      const nextBtn = screen.getByText('Next');
      expect(nextBtn).not.toBeDisabled();
      expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();

      fireEvent.click(nextBtn);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    test('EmptyState renders message and icon', () => {
      render(<EmptyState message="No incidents found." />);
      expect(screen.getByText('No incidents found.')).toBeInTheDocument();
    });

    test('ErrorHandler returns null when no error and renders data-testid when error exists', () => {
      const { container, rerender } = render(<ErrorHandler error={null} />);
      expect(container.firstChild).toBeNull();

      rerender(<ErrorHandler error="Something went wrong" />);
      expect(screen.getByTestId('error-handler')).toHaveTextContent('Something went wrong');
    });

    test('SearchFilterBar renders placeholder and triggers callbacks', () => {
      const onSearch = jest.fn();
      const onFilterChange = jest.fn();
      render(
        <SearchFilterBar
          onSearch={onSearch}
          onFilterChange={onFilterChange}
        />
      );
      const searchInput = screen.getByPlaceholderText('Search by title...');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'Crash' } });
      expect(onSearch).toHaveBeenCalledWith('Crash');
    });

    test('Alert component auto-dismisses', async () => {
      const onClose = jest.fn();
      render(
        <Alert
          message="TrafficIncident Created Successfully"
          type="success"
          duration={100}
          onClose={onClose}
        />
      );
      expect(screen.getByText('TrafficIncident Created Successfully')).toBeInTheDocument();
      await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 500 });
    });
  });

  describe('Dashboard Components', () => {
    test('StatCards renders KPI cards with exact titles', () => {
      render(
        <StatCards
          totalIncidents={12}
          activeOutages={3}
          congestedZones={4}
          criticalAlerts={2}
        />
      );
      expect(screen.getByText('Total Incidents')).toBeInTheDocument();
      expect(screen.getByText('Active Outages')).toBeInTheDocument();
      expect(screen.getByText('Critical Alerts')).toBeInTheDocument();
      expect(screen.getByText('Congested Zones')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('IncidentStatusDonut handles empty data gracefully', () => {
      render(<IncidentStatusDonut incidents={[]} />);
      expect(screen.getByText('No incident status data available.')).toBeInTheDocument();
    });

    test('RecentActivity handles empty data gracefully', () => {
      render(<RecentActivity activities={[]} />);
      expect(screen.getByText('No recent activity recorded.')).toBeInTheDocument();
    });
  });

  describe('TrafficIncident Components', () => {
    test('TrafficIncidentList renders heading and empty state', () => {
      renderWithProviders(<TrafficIncidentList />, {
        preloadedState: {
          trafficIncident: { items: [], loading: false, error: null },
          auth: { user: { role: 'TRAFFIC_CONTROLLER' } },
        },
      });
      expect(screen.getByRole('heading', { name: 'Traffic Incidents' })).toBeInTheDocument();
      expect(screen.getByText('No incidents found.')).toBeInTheDocument();
      expect(screen.getByText('+ Add Record')).toBeInTheDocument();
    });

    test('TrafficIncidentList renders items table with delete button', () => {
      const items = [
        {
          incidentId: 1,
          title: 'Accident on Main St',
          severity: 'HIGH',
          status: 'REPORTED',
          zone: { zoneName: 'Downtown' },
        },
      ];
      renderWithProviders(<TrafficIncidentList />, {
        preloadedState: {
          trafficIncident: { items, loading: false, error: null },
          auth: { user: { role: 'CITY_ADMINISTRATOR' } },
        },
      });
      expect(screen.getByText('Accident on Main St')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    test('TrafficIncidentForm renders fields and handles create mode', () => {
      renderWithProviders(<TrafficIncidentForm onClose={jest.fn()} />);
      expect(screen.getByText('Report New Incident')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Major Collision on Main St')).toBeInTheDocument();
      expect(screen.getByLabelText('Severity')).toBeInTheDocument();
      expect(screen.getByLabelText('Traffic Zone')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Report Incident' })).toBeInTheDocument();
      expect(screen.getByText('X')).toBeInTheDocument();
    });

    test('TrafficIncidentForm handles edit mode and Save Changes', () => {
      const incident = {
        incidentId: 10,
        title: 'Water Main Break',
        severity: 'CRITICAL',
        zoneId: 1,
      };
      renderWithProviders(<TrafficIncidentForm incident={incident} onClose={jest.fn()} />);
      expect(screen.getByText('Edit Traffic Incident')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });

  describe('UtilityGrid and UtilityOutage Lists', () => {
    test('UtilityGridList renders heading and empty state', () => {
      renderWithProviders(<UtilityGridList />, {
        preloadedState: {
          utilityGrid: { items: [], loading: false, error: null },
          auth: { user: { role: 'CITY_ADMINISTRATOR' } },
        },
      });
      expect(screen.getByRole('heading', { name: 'Utility Grids' })).toBeInTheDocument();
      expect(screen.getByText('No utility grids monitored.')).toBeInTheDocument();
    });

    test('UtilityOutageList renders heading and empty state', () => {
      renderWithProviders(<UtilityOutageList />, {
        preloadedState: {
          utilityOutage: { items: [], loading: false, error: null },
          auth: { user: { role: 'UTILITY_SUPERVISOR' } },
        },
      });
      expect(screen.getByRole('heading', { name: 'Utility Outages' })).toBeInTheDocument();
      expect(screen.getByText('No utility outages found.')).toBeInTheDocument();
    });
  });

  describe('NotificationStack Component', () => {
    test('renders notifications with X button and type class', () => {
      renderWithProviders(<NotificationStack />, {
        preloadedState: {
          alertNotification: {
            notifications: [
              { id: '1', message: 'TrafficIncident created successfully', type: 'success' },
              { id: '2', message: 'Overlapping outage registered', type: 'error' },
            ],
          },
        },
      });
      expect(screen.getByText('TrafficIncident created successfully')).toBeInTheDocument();
      expect(screen.getByText('Overlapping outage registered')).toBeInTheDocument();
      expect(screen.getAllByText('X')).toHaveLength(2);
    });
  });
});
