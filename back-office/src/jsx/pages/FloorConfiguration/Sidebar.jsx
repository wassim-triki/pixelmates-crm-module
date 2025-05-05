// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

// available shapes in the palette
const SHAPES = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
];

export default function Sidebar({
  tableCounts = {}, // { rectangle: 2, circle: 1, ... }
  onShapeDragStart, // (shapeId) => void
  selectedTable, // { name, minCovers, maxCovers, online }
  onDetailChange, // (field, value) => void
}) {
  return (
    <aside className="sidebar">
      {/* Table Options */}
      <div className="section table-options">
        <h3>Table Options</h3>
        <p className="subtitle">Drag &amp; drop your tables</p>
        <div className="shape-palette">
          {SHAPES.map((shape) => (
            <div
              key={shape.id}
              className={`shape-item ${shape.id}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('shapeId', shape.id);
                onShapeDragStart(shape.id);
              }}
            >
              <div className="shape-icon">🌐</div>
              <span className="shape-count">{tableCounts[shape.id] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details for selected table */}
      <div
        className={`section table-details ${
          !selectedTable ? 'no-selection' : ''
        }`}
      >
        <h3>Table Details</h3>
        {!selectedTable ? (
          <div className="no-selection-text">
            Select a table to edit its properties
          </div>
        ) : (
          <>
            <div className="field">
              <label>Table Name</label>
              <input
                type="text"
                value={selectedTable.name}
                onChange={(e) => onDetailChange('name', e.target.value)}
              />
            </div>

            <div className="field counter-field">
              <label>Min Covers</label>
              <div className="counter">
                <button
                  type="button"
                  onClick={() =>
                    onDetailChange(
                      'minCovers',
                      Math.max(1, selectedTable.minCovers - 1)
                    )
                  }
                >
                  –
                </button>
                <input readOnly type="number" value={selectedTable.minCovers} />
                <button
                  type="button"
                  onClick={() =>
                    onDetailChange('minCovers', selectedTable.minCovers + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="field counter-field">
              <label>Max Covers</label>
              <div className="counter">
                <button
                  type="button"
                  onClick={() =>
                    onDetailChange(
                      'maxCovers',
                      Math.max(
                        selectedTable.minCovers,
                        selectedTable.maxCovers - 1
                      )
                    )
                  }
                >
                  –
                </button>
                <input readOnly type="number" value={selectedTable.maxCovers} />
                <button
                  type="button"
                  onClick={() =>
                    onDetailChange('maxCovers', selectedTable.maxCovers + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="field toggle-field">
              <label>Online</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={selectedTable.online}
                  onChange={(e) => onDetailChange('online', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
