// src/components/Canvas.jsx
import React, { useRef } from 'react';
import { FaGlobe } from 'react-icons/fa';
import './Canvas.css';

export default function Canvas({ tables, onDropTable, onSelectTable }) {
  const canvasRef = useRef(null);

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('shapeId');
    if (!shapeId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 32; // center the table
    const y = e.clientY - rect.top - 32;
    onDropTable(shapeId, x, y);
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {tables.length === 0 && (
        <div className="canvas-placeholder">Drop a table here</div>
      )}

      {tables.map((table) => (
        <div
          key={table.id}
          className={`table-instance ${table.shape}`}
          style={{ top: table.y, left: table.x }}
          onClick={() => onSelectTable(table)}
        >
          {table.online && <FaGlobe className="online-icon" />}
          <div className="label-top">
            #{table.minCovers}-{table.maxCovers}
          </div>
          <div className="label-bottom">{table.name}</div>
        </div>
      ))}
    </div>
  );
}
