// src/pages/FloorConfiguration.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import './FloorConfiguration.css';

export default function FloorConfiguration() {
  const [tableCounts, setTableCounts] = useState({ rectangle: 0, circle: 0 });
  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const getNextName = () => {
    // find numeric names and pick next
    const nums = tables
      .map((t) => parseInt(t.name, 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return String(max + 1);
  };

  const handleDrop = (shape, x, y) => {
    const name = getNextName();
    const count = tables.length + 1;
    setTableCounts({ ...tableCounts, [shape]: count });
    const newTable = {
      id: uuidv4(),
      shape,
      x,
      y,
      w: 64,
      h: 64,
      name,
      minCovers: 1,
      maxCovers: 4,
      online: true,
    };
    setTables((prev) => [...prev, newTable]);
    setSelectedId(newTable.id);
  };

  const handleSelect = (id) => setSelectedId(id);
  const handleUpdate = (id, upd) =>
    setTables((ts) => ts.map((t) => (t.id === id ? { ...t, ...upd } : t)));

  const handleDuplicate = (id) => {
    const orig = tables.find((t) => t.id === id);
    if (!orig) return;
    const name = getNextName();
    const copy = {
      ...orig,
      id: uuidv4(),
      x: orig.x + 20,
      y: orig.y + 20,
      name,
    };
    setTables((prev) => [...prev, copy]);
    setSelectedId(copy.id);
  };

  const handleDelete = (id) => {
    setTables((ts) => ts.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleToggleShape = (id) => {
    setTables((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, shape: t.shape === 'circle' ? 'rectangle' : 'circle' }
          : t
      )
    );
  };

  return (
    <div className="floor-config">
      <Sidebar
        tableCounts={tableCounts}
        onShapeDragStart={() => {}}
        selectedTable={tables.find((t) => t.id === selectedId)}
        onDetailChange={(field, value) =>
          handleUpdate(selectedId, { [field]: value })
        }
      />
      <Canvas
        tables={tables}
        selectedId={selectedId}
        onDrop={handleDrop}
        onSelect={handleSelect}
        onUpdate={handleUpdate}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onToggleShape={handleToggleShape}
      />
    </div>
  );
}
