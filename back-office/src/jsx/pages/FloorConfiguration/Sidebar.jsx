// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { FaGlobe } from 'react-icons/fa';

const SHAPES = [
  { id: 'rectangle', label: 'Square' },
  { id: 'circle', label: 'Circle' },
];

export default function Sidebar({
  tableCounts = {},
  onShapeDragStart,
  selectedTable,
  onDetailChange,
  handleSubmit,
  submitting,
  successMsg,
  errorMsg,
}) {
  return (
    <aside className="sidebar">
      <div className="section table-options">
        <h3>Table Options</h3>
        <p className="subtitle">Drag & drop your tables</p>
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
              <div className="shape-icon">
                <FaGlobe />
              </div>
              <span className="shape-count">{tableCounts[shape.id] || 0}</span>
            </div>
          ))}
        </div>
      </div>

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
              <label>Table Number</label>
              <input
                type="text"
                value={selectedTable.number}
                onChange={(e) => onDetailChange('number', e.target.value)}
              />
            </div>
            <div className="field counter-field">
              <label>Min Covers</label>
              <div className="counter">
                <button
                  onClick={() =>
                    onDetailChange(
                      'minCovers',
                      Math.max(1, selectedTable.minCovers - 1)
                    )
                  }
                >
                  –
                </button>
                <input readOnly value={selectedTable.minCovers} />
                <button
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
                <input readOnly value={selectedTable.maxCovers} />
                <button
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

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="text-center">
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting && (
            <span className="spinner-border spinner-border-sm me-2" />
          )}
          Save
        </button>
      </div>
    </aside>
  );
}
