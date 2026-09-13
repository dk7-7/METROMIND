import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll } from '../../store/slices/fieldObservationSlice';
import FieldObservationForm from './FieldObservationForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';
import './FieldObservationList.css';

const FieldObservationList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.fieldObservation || state.fieldObservations || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // Pagination - 5 per page
  const itemsPerPage = 5;
  const rawItems = Array.isArray(items) ? items : [];
  const totalItems = rawItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rawItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="observation-list-container">
      <div className="page-header">
        <h1>Field Observations</h1>

        <button
          type="button"
          className="btn-add-observation"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Observation
        </button>
      </div>

      {error && <ErrorHandler error={error} />}

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          duration={3000}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {loading && rawItems.length === 0 && !error ? (
        <div className="loading-state">Loading...</div>
      ) : rawItems.length === 0 ? (
        <EmptyState message="No field observations found." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Observation</th>
                  <th>Sensor Reading</th>
                  <th>Unit</th>
                  <th>Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((obs) => {
                  const id = obs.observationId || obs.id;

                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td>{obs.observationText}</td>
                      <td>{obs.sensorReadingValue != null ? obs.sensorReadingValue : 'N/A'}</td>
                      <td>{obs.unit || 'N/A'}</td>
                      <td>
                        {obs.latitude != null && obs.longitude != null
                          ? `${obs.latitude}, ${obs.longitude}`
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {isModalOpen && (
        <FieldObservationForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            dispatch(fetchAll());
          }}
        />
      )}
    </div>
  );
};

export default FieldObservationList;