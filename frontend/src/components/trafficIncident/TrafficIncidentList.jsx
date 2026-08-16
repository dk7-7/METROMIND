import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAll,
  deleteRecord,
  clearMessages,
} from "../../store/slices/trafficIncidentSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import SearchFilterBar from "../common/SearchFilterBar";
import TrafficIncidentForm from "./TrafficIncidentForm";
import Alert from "../common/Alert";

const ITEMS_PER_PAGE = 5;
const STATUSES = ["REPORTED", "DISPATCHED", "RESOLVED", "CLOSED"];

const TrafficIncidentList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector(
    (state) => state.trafficIncident
  );
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const filtered = items.filter((incident) => {
    const matchesSearch = incident.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter ? incident.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const canManage = role === "CITY_ADMINISTRATOR" || role === "TRAFFIC_CONTROLLER";

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      dispatch(deleteRecord(id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Traffic Incidents</h2>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingIncident(null);
              setShowForm(true);
            }}
          >
            + Add Record
          </button>
        )}
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && (
        <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />
      )}

      <SearchFilterBar
        onSearch={setSearch}
        onFilterChange={setStatusFilter}
        filterOptions={STATUSES}
      />

      {!loading && filtered.length === 0 ? (
        <EmptyState message="No incidents found." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Zone</th>
                <th>Reported At</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((incident) => (
                <tr key={incident.incidentId}>
                  <td>{incident.title}</td>
                  <td>{incident.incidentType}</td>
                  <td>{incident.severity}</td>
                  <td>{incident.status}</td>
                  <td>{incident.zone?.zoneName}</td>
                  <td>{incident.reportedAt}</td>
                  {canManage && (
                    <td>
                      <button
                        className="action-link"
                        onClick={() => {
                          setEditingIncident(incident);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-link delete"
                        onClick={() => handleDelete(incident.incidentId)}
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
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      {showForm && (
        <TrafficIncidentForm
          incident={editingIncident}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TrafficIncidentList;
