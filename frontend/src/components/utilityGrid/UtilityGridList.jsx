import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, clearMessages } from "../../store/slices/utilityGridSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import CapacityBar from "../common/CapacityBar";
import Alert from "../common/Alert";
import UtilityGridForm from "./UtilityGridForm";

const ITEMS_PER_PAGE = 5;

const UtilityGridList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector((state) => state.utilityGrid);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const canManage = role === "UTILITY_SUPERVISOR";

  const [page, setPage] = useState(1);
  const [editingGrid, setEditingGrid] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Utility Grids</h2>
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />}

      {!loading && items.length === 0 ? (
        <EmptyState message="No utility grids monitored." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Grid Name</th>
                <th>Type</th>
                <th>District</th>
                <th>Load / Capacity</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((grid) => (
                <tr key={grid.gridId}>
                  <td>{grid.gridName}</td>
                  <td>{grid.gridType}</td>
                  <td>{grid.district}</td>
                  <td>
                    <CapacityBar current={grid.currentLoad} total={grid.capacityUnits} />
                  </td>
                  <td>
                    <span className="status-badge">{grid.status}</span>
                  </td>
                  {canManage && (
                    <td>
                      <button className="action-link" onClick={() => setEditingGrid(grid)}>
                        Edit
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

      {editingGrid && (
        <UtilityGridForm grid={editingGrid} onClose={() => setEditingGrid(null)} />
      )}
    </div>
  );
};

export default UtilityGridList;
