import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, deleteZone, clearMessages } from "../../store/slices/trafficZoneSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";
import TrafficZoneForm from "./TrafficZoneForm";

const ITEMS_PER_PAGE = 5;

const TrafficZoneList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector((state) => state.trafficZone);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const canManage = role === "CITY_ADMINISTRATOR" || role === "TRAFFIC_CONTROLLER";

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      dispatch(deleteZone(id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Traffic Zones</h2>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingZone(null);
              setShowForm(true);
            }}
          >
            + Add Zone
          </button>
        )}
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />}

      {!loading && items.length === 0 ? (
        <EmptyState message="No traffic zones monitored." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Zone Code</th>
                <th>Name</th>
                <th>District</th>
                <th>Congestion</th>
                <th>Signal Cycle (s)</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((zone) => (
                <tr key={zone.zoneId}>
                  <td>{zone.zoneCode}</td>
                  <td>{zone.zoneName}</td>
                  <td>{zone.district}</td>
                  <td>
                    <span className="status-badge">{zone.currentCongestionLevel}</span>
                  </td>
                  <td>{zone.signalCycleSeconds}</td>
                  {canManage && (
                    <td>
                      <button
                        className="action-link"
                        onClick={() => {
                          setEditingZone(zone);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-link delete"
                        onClick={() => handleDelete(zone.zoneId)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
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

      {showForm && (
        <TrafficZoneForm zone={editingZone} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default TrafficZoneList;
