import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, clearMessages } from "../../store/slices/fieldObservationSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";
import FieldObservationForm from "./FieldObservationForm";

const ITEMS_PER_PAGE = 5;

const FieldObservationList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector(
    (state) => state.fieldObservation
  );
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const canManage = role === "FIELD_TECHNICIAN";

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Field Observations</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Observation
          </button>
        )}
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />}

      {!loading && items.length === 0 ? (
        <EmptyState message="No field observations recorded." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Observation</th>
                <th>Reading</th>
                <th>Unit</th>
                <th>Technician</th>
                <th>Observed At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((obs) => (
                <tr key={obs.observationId}>
                  <td>{obs.observationText}</td>
                  <td>{obs.sensorReadingValue}</td>
                  <td>{obs.unit}</td>
                  <td>{obs.technician?.fullName}</td>
                  <td>{obs.observedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalItems={items.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      {showForm && <FieldObservationForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default FieldObservationList;
