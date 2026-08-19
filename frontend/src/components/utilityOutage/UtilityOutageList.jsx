import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, clearMessages } from "../../store/slices/utilityOutageSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";
import UtilityOutageForm from "./UtilityOutageForm";

const ITEMS_PER_PAGE = 5;

const UtilityOutageList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector((state) => state.utilityOutage);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const canManage = role === "UTILITY_SUPERVISOR";

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Utility Outages</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Report Outage
          </button>
        )}
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />}

      {!loading && items.length === 0 ? (
        <EmptyState message="No utility outages recorded." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Grid</th>
                <th>Type</th>
                <th>Affected Area</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((outage) => (
                <tr key={outage.outageId}>
                  <td>{outage.grid?.gridName}</td>
                  <td>{outage.outageType}</td>
                  <td>{outage.affectedArea}</td>
                  <td>{outage.severity}</td>
                  <td>
                    <span className="status-badge">{outage.status}</span>
                  </td>
                  <td>{outage.startTime}</td>
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

      {showForm && <UtilityOutageForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default UtilityOutageList;
