import React, { useRef } from 'react';
import { FaGlobe, FaClone, FaTrash, FaSquare, FaCircle } from 'react-icons/fa';
import { Rnd } from 'react-rnd';
import './Canvas.css';

export default function Canvas({
  tables,
  selectedId,
  onDrop,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onToggleShape,
  interactive = true,
}) {
  const ref = useRef(null);

  const handleDragOver = (e) => {
    if (!interactive) return;
    e.preventDefault();
  };

  const handleDrop = (e) => {
    if (!interactive) return;
    e.preventDefault();
    const shape = e.dataTransfer.getData('shapeId');
    if (!shape) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 32;
    const y = e.clientY - rect.top - 32;
    onDrop && onDrop(shape, x, y);
    e.stopPropagation();
  };

  const handleCanvasClick = (e) => {
    if (!interactive) return;
    if (e.target === ref.current) onSelect && onSelect(null);
  };

  return (
    <div
      ref={ref}
      className="canvas"
      {...(interactive
        ? {
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            onClick: handleCanvasClick,
          }
        : {})}
    >
      {tables.map((table) => {
        const isSelected = table.id === selectedId;

        // only show resize handles when interactive AND this table is selected
        const resizeHandleStyles =
          interactive && isSelected
            ? {
                topLeft: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  cursor: 'nw-resize',
                  zIndex: 10,
                },
                topRight: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  cursor: 'ne-resize',
                  zIndex: 10,
                },
                bottomLeft: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  bottom: -6,
                  left: -6,
                  cursor: 'sw-resize',
                  zIndex: 10,
                },
                bottomRight: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  bottom: -6,
                  right: -6,
                  cursor: 'se-resize',
                  zIndex: 10,
                },
                top: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  cursor: 'n-resize',
                  zIndex: 10,
                },
                bottom: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  cursor: 's-resize',
                  zIndex: 10,
                },
                left: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: '50%',
                  left: -6,
                  transform: 'translateY(-50%)',
                  cursor: 'w-resize',
                  zIndex: 10,
                },
                right: {
                  width: 10,
                  height: 10,
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: '50%',
                  right: -6,
                  transform: 'translateY(-50%)',
                  cursor: 'e-resize',
                  zIndex: 10,
                },
              }
            : {};

        return (
          <Rnd
            key={table.id}
            className={`table-instance ${table.shape} ${
              isSelected ? 'selected' : ''
            }`}
            size={{ width: table.w, height: table.h }}
            position={{ x: table.x, y: table.y }}
            bounds="parent"
            disableDragging={!interactive}
            enableResizing={interactive && isSelected}
            resizeHandleStyles={resizeHandleStyles}
            {...(interactive
              ? {
                  onDragStop: (e, d) =>
                    onUpdate && onUpdate(table.id, { x: d.x, y: d.y }),
                  onResizeStop: (e, dir, refEl, delta, pos) =>
                    onUpdate &&
                    onUpdate(table.id, {
                      x: pos.x,
                      y: pos.y,
                      w: refEl.offsetWidth,
                      h: refEl.offsetHeight,
                    }),
                }
              : {})}
            onClick={(e) => {
              e.stopPropagation();
              if (interactive) onSelect && onSelect(table.id);
            }}
          >
            {table.online && <FaGlobe className="online-icon" />}
            <div className="label-top">
              #{table.minCovers}-{table.maxCovers}
            </div>
            <div className="label-bottom">{table.number}</div>
            {interactive && isSelected && (
              <div className="toolbar">
                <button
                  onClick={() => onToggleShape && onToggleShape(table.id)}
                >
                  {table.shape === 'circle' ? <FaSquare /> : <FaCircle />}
                </button>
                <button onClick={() => onDuplicate && onDuplicate(table.id)}>
                  <FaClone />
                </button>
                <button onClick={() => onDelete && onDelete(table.id)}>
                  <FaTrash />
                </button>
              </div>
            )}
          </Rnd>
        );
      })}
    </div>
  );
}
