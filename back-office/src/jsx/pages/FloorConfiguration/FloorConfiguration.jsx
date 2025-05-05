// src/pages/FloorConfiguration.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import './FloorConfiguration.css';

export default function FloorConfiguration() {
  const [tableCounts, setTableCounts] = useState({ rectangle: 0, circle: 0 });
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleShapeDragStart = (shapeId) => {
    // placeholder if needed later
  };

  const handleDropTable = (shapeId, x, y) => {
    setTableCounts((c) => ({ ...c, [shapeId]: (c[shapeId] || 0) + 1 }));
    const newTable = {
      id: uuidv4(),
      shape: shapeId,
      x,
      y,
      name: String((tableCounts[shapeId] || 0) + 1),
      minCovers: 1,
      maxCovers: 4,
      online: true,
    };
    setTables((ts) => [...ts, newTable]);
    setSelectedTable(newTable);
  };

  const handleSelectTable = (table) => setSelectedTable(table);

  const handleDetailChange = (field, value) => {
    setTables((ts) =>
      ts.map((t) => (t.id === selectedTable.id ? { ...t, [field]: value } : t))
    );
    setSelectedTable((st) => ({ ...st, [field]: value }));
  };

  return (
    <div className="floor-config">
      <Sidebar
        tableCounts={tableCounts}
        onShapeDragStart={handleShapeDragStart}
        selectedTable={selectedTable}
        onDetailChange={handleDetailChange}
      />
      <Canvas
        tables={tables}
        onDropTable={handleDropTable}
        onSelectTable={handleSelectTable}
      />
    </div>
  );
}
