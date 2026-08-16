import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGrids } from '../../store/utilityGrid/utilityGridActions';
import CapacityBar from '../common/CapacityBar';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import ErrorHandler from '../common/ErrorHandler';

const UtilityGridList = () => {
    const dispatch = useDispatch();
    const { grids, loading, error } = useSelector(state => state.utilityGrid);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllGrids());
    }, [dispatch]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedGrids = grids.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Utility Grids</h2>
            <ErrorHandler error={error} />
            
            {!loading && grids.length === 0 ? (
                <EmptyState message="No utility grids monitored." />
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Grid Name</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>District</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Load / Capacity</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedGrids.map((grid, index) => (
                                <tr key={grid.gridId || grid.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>{grid.gridName || grid.name}</td>
                                    <td style={{ padding: '1rem' }}>{grid.gridType || grid.type}</td>
                                    <td style={{ padding: '1rem' }}>{grid.district}</td>
                                    <td style={{ padding: '1rem', width: '200px' }}>
                                        <div style={{ marginBottom: '4px', fontSize: '0.875rem' }}>{grid.currentLoad} / {grid.capacityUnits || grid.maxCapacity}</div>
                                        <CapacityBar current={grid.currentLoad} total={grid.capacityUnits || grid.maxCapacity} />
                                    </td>
                                    <td style={{ padding: '1rem' }}>{grid.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                            totalItems={grids.length} 
                            itemsPerPage={itemsPerPage} 
                            currentPage={currentPage} 
                            onPageChange={setCurrentPage} 
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default UtilityGridList;
