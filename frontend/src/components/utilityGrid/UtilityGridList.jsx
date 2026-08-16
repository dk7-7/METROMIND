import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGrids } from '../../store/utilityGrid/utilityGridActions';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import CapacityBar from '../common/CapacityBar';

const UtilityGridList = () => {
    const dispatch = useDispatch();
    const { grids, loading } = useSelector(state => state.utilityGrid);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllGrids());
    }, [dispatch]);

    const paginated = grids.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2>Utility Grids</h2>
            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No utility grids monitored." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Grid name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>District</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Load / Capacity</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(grid => (
                                <tr key={grid.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{grid.name}</td>
                                    <td style={{ padding: '0.75rem' }}>{grid.type}</td>
                                    <td style={{ padding: '0.75rem' }}>{grid.district}</td>
                                    <td style={{ padding: '0.75rem', width: '200px' }}>
                                        <div style={{ marginBottom: '4px', fontSize: '0.875rem' }}>{grid.currentLoad} / {grid.totalCapacity}</div>
                                        <CapacityBar current={grid.currentLoad} total={grid.totalCapacity} />
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{grid.status}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={grids.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};
export default UtilityGridList;
