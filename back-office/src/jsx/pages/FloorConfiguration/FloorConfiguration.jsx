import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import './FloorConfiguration.css';
import { useAuth } from '../../../context/authContext';
import axiosInstance from '../../../config/axios';

export default function FloorConfiguration() {
  const { user } = useAuth();

  // Each table has both server _id and UI-only id
  const [tables, setTables] = useState([]);
  const [selectedId, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing tables
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          `/restaurants/${user.restaurant._id}/tables`
        );
        // Map to include UI-only `id`
        setTables(
          res.data.map((t) => ({
            ...t,
            id: t._id,
          }))
        );
      } catch (err) {
        console.error(err);
        setErrorMsg('Unable to load tables.');
      }
    })();
  }, [user.restaurant._id]);

  // Build payload: include _id only if present (server docs), omit for new/duplicate
  const formatData = () =>
    tables.map((t) => {
      const doc = {
        number: String(t.number),
        minCovers: t.minCovers,
        maxCovers: t.maxCovers,
        isAvailable: t.isAvailable,
        x: t.x,
        y: t.y,
        w: t.w,
        h: t.h,
        shape: t.shape,
        // qrcode: t.qrcode || uuidv4(),
      };
      if (t._id) {
        doc._id = t._id;
      }
      return doc;
    });

  // Bulk save (upsert existing, insert new)
  const handleSubmit = async () => {
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await axiosInstance.put(
        `/restaurants/${user.restaurant._id}/tables`,
        formatData()
      );
      // Refresh state, map server _id into UI id
      setTables(
        res.data.map((t) => ({
          ...t,
          id: t._id,
        }))
      );
      setSuccessMsg('Tables saved successfully.');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(`Save failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getNextNumber = () => {
    const nums = tables
      .map((t) => parseInt(t.number, 10))
      .filter((n) => !isNaN(n));
    return nums.length ? Math.max(...nums) + 1 : 1;
  };

  const handleDrop = (shape, x, y) => {
    const newTable = {
      id: uuidv4(), // UI-only
      shape,
      x,
      y,
      w: 64,
      h: 64,
      number: getNextNumber(),
      minCovers: 1,
      maxCovers: 4,
      isAvailable: true,
      // qrcode: uuidv4(),
    };
    setTables((ts) => [...ts, newTable]);
    setSelected(newTable.id);
  };

  const handleUpdate = (id, upd) =>
    setTables((ts) => ts.map((t) => (t.id === id ? { ...t, ...upd } : t)));
  const handleSelect = (id) => setSelected(id);
  const handleDuplicate = (id) => {
    const orig = tables.find((t) => t.id === id);
    if (!orig) return;
    const copy = {
      ...orig,
      id: uuidv4(), // new UI id
      _id: undefined, // ensure insert branch
      x: orig.x + 20,
      y: orig.y + 20,
      number: getNextNumber(),
    };
    setTables((ts) => [...ts, copy]);
    setSelected(copy.id);
  };
  const handleDelete = (id) => {
    setTables((ts) => ts.filter((t) => t.id !== id));
    if (selectedId === id) setSelected(null);
  };
  const handleToggleShape = (id) =>
    setTables((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, shape: t.shape === 'circle' ? 'rectangle' : 'circle' }
          : t
      )
    );

  const tableCounts = tables.reduce(
    (acc, t) => {
      if (t.shape === 'rectangle') acc.rectangle++;
      if (t.shape === 'circle') acc.circle++;
      return acc;
    },
    { rectangle: 0, circle: 0 }
  );

  return (
    <div className="floor-config">
      <Sidebar
        tableCounts={tableCounts}
        onShapeDragStart={() => {}}
        selectedTable={tables.find((t) => t.id === selectedId)}
        onDetailChange={(f, v) => handleUpdate(selectedId, { [f]: v })}
        handleSubmit={handleSubmit}
        submitting={submitting}
        successMsg={successMsg}
        errorMsg={errorMsg}
      />

      <div className="canvas-wrapper">
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
    </div>
  );
}
