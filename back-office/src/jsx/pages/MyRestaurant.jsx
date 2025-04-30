// src/components/MyRestaurant.jsx
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/authContext';
import { getRestaurantById } from '../../services/RestaurantService';
import { FaTrash } from 'react-icons/fa';
import styles from './MyRestaurant.module.css';
import axiosInstance from '../../config/axios';
import Preloader from '../components/Preloader';

// react-leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { icon } from 'leaflet';

// import the marker images
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// create a proper Leaflet icon instance
const markerIcon = icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});

const MyRestaurant = () => {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?._id;

  const [restaurant, setRestaurant] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [originalLocation, setOriginalLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // default to Tunis coordinates
  const [location, setLocation] = useState({ lat: 36.8065, lng: 10.1815 });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [thumbDrag, setThumbDrag] = useState(false);
  const [galleryDrag, setGalleryDrag] = useState(false);

  const thumbnailInputRef = useRef();
  const galleryInputRef = useRef();

  // helper to PUT multipart
  const updateRestaurant = (id, payload) =>
    axiosInstance.put(`/restaurants/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

  // map click listener component
  function LocationSelector() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return null;
  }

  // load existing data
  useEffect(() => {
    if (!restaurantId) return;
    (async () => {
      try {
        const res = await getRestaurantById(restaurantId);
        const data = res.data;
        setRestaurant(data);

        // pull in saved coords if any
        const initLoc = data.location
          ? { lat: data.location.latitude, lng: data.location.longitude }
          : { lat: 36.8065, lng: 10.1815 };
        setLocation(initLoc);
        setOriginalLocation(initLoc);

        setOriginalData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          thumbnail: data.thumbnail || '',
          images: data.images || [],
        });
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
        });
      } catch {
        setErrorMessage('Could not load restaurant data.');
      }
    })();
  }, [restaurantId]);

  // clean up object URLs
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [thumbnailPreview, galleryPreviews]);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleChange = ({ target: { name, value } }) =>
    setFormData((p) => ({ ...p, [name]: value }));

  // thumbnail handlers…
  const handleThumbnailChange = (e) => {
    const f = e.target.files[0];
    if (!f?.type.startsWith('image/')) return;
    setThumbnailFile(f);
    setThumbnailPreview(URL.createObjectURL(f));
    setRemoveThumbnail(false);
    setRestaurant((r) => ({ ...r, thumbnail: '' }));
  };
  const handleThumbnailDrop = (e) => {
    preventDefaults(e);
    setThumbDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) {
      setThumbnailFile(f);
      setThumbnailPreview(URL.createObjectURL(f));
      setRemoveThumbnail(false);
      setRestaurant((r) => ({ ...r, thumbnail: '' }));
    }
  };
  const handleRemoveThumbnail = (e) => {
    e.stopPropagation();
    setThumbnailFile(null);
    setThumbnailPreview('');
    setRemoveThumbnail(true);
    thumbnailInputRef.current && (thumbnailInputRef.current.value = null);
    setRestaurant((r) => ({ ...r, thumbnail: '' }));
  };

  // gallery handlers…
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (!files.length) return;
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    setRestaurant((r) => ({ ...r, images: [] }));
  };
  const handleGalleryDrop = (e) => {
    preventDefaults(e);
    setGalleryDrag(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (!files.length) return;
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    setRestaurant((r) => ({ ...r, images: [] }));
  };
  const handleRemoveGalleryImage = (idx) => {
    if (galleryPreviews.length) {
      setGalleryFiles((p) => p.filter((_, i) => i !== idx));
      setGalleryPreviews((p) => p.filter((_, i) => i !== idx));
    } else {
      setRestaurant((r) => ({
        ...r,
        images: r.images.filter((_, i) => i !== idx),
      }));
    }
  };

  // form validation
  const isFormValid = formData.name.trim() !== '';
  const isModified =
    originalData &&
    (formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.address !== originalData.address ||
      removeThumbnail ||
      !!thumbnailFile ||
      galleryFiles.length > 0 ||
      (restaurant.images || []).length !== (originalData.images || []).length ||
      (originalLocation &&
        (location.lat !== originalLocation.lat ||
          location.lng !== originalLocation.lng)));

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || !isModified) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('address', formData.address);
      payload.append('latitude', location.lat);
      payload.append('longitude', location.lng);

      if (removeThumbnail && !thumbnailFile) payload.append('thumbnail', '');
      if (thumbnailFile) payload.append('thumbnail', thumbnailFile);

      if (galleryFiles.length === 0) {
        payload.append('images', JSON.stringify(restaurant.images || []));
      } else {
        galleryFiles.forEach((f) => payload.append('images', f));
      }

      const res = await updateRestaurant(restaurantId, payload);
      const data = res.data;
      setRestaurant(data);
      setOriginalData({
        name: data.name,
        description: data.description,
        address: data.address,
        thumbnail: data.thumbnail || '',
        images: data.images || [],
      });
      setOriginalLocation({
        lat: data.location.latitude,
        lng: data.location.longitude,
      });

      setSuccessMessage('Restaurant updated successfully!');
      // reset inputs
      setThumbnailFile(null);
      setThumbnailPreview('');
      setRemoveThumbnail(false);
      thumbnailInputRef.current && (thumbnailInputRef.current.value = null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      galleryInputRef.current && (galleryInputRef.current.value = null);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return <Preloader />;

  return (
    <div className="my-restaurant container mt-2">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <h2 className="mb-4">Setup your restaurant</h2>

      <form onSubmit={handleSubmit}>
        {/* Images Upload */}
        <div className="mb-4">
          <label className="form-label">Images</label>
          <div className="d-flex align-items-start gap-4">
            {/* Thumbnail Dropzone */}
            <div
              className={`${styles.dropzone} ${styles.thumbnailZone} ${
                thumbDrag ? styles.dragover : ''
              }`}
              onClick={() => thumbnailInputRef.current.click()}
              onDragEnter={(e) => {
                preventDefaults(e);
                setThumbDrag(true);
              }}
              onDragOver={preventDefaults}
              onDragLeave={(e) => {
                preventDefaults(e);
                setThumbDrag(false);
              }}
              onDrop={handleThumbnailDrop}
            >
              {thumbnailPreview || restaurant.thumbnail ? (
                <div className={styles.imgWrapper}>
                  <img
                    src={thumbnailPreview || restaurant.thumbnail}
                    alt="Thumbnail"
                    className={styles.fitImage}
                  />
                  <div className={styles.overlay}>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={handleRemoveThumbnail}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyPlaceholder}>
                  Drag &amp; drop or click to add a <strong>thumbnail</strong>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
              />
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: '#e0e0e0', height: 120 }} />

            {/* Gallery Dropzone */}
            <div
              className={`${styles.dropzone} ${styles.galleryZone} ${
                galleryDrag ? styles.dragover : ''
              }`}
              onClick={() => galleryInputRef.current.click()}
              onDragEnter={(e) => {
                preventDefaults(e);
                setGalleryDrag(true);
              }}
              onDragOver={preventDefaults}
              onDragLeave={(e) => {
                preventDefaults(e);
                setGalleryDrag(false);
              }}
              onDrop={handleGalleryDrop}
            >
              {galleryPreviews.length > 0 ? (
                galleryPreviews.map((url, idx) => (
                  <div key={idx} className={styles.imgWrapper}>
                    <img
                      src={url}
                      alt={`Gallery ${idx}`}
                      className={styles.fitImage}
                    />
                    <div className={styles.overlay}>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGalleryImage(idx);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : restaurant.images && restaurant.images.length ? (
                restaurant.images.map((url, i) => (
                  <div key={i} className={styles.imgWrapper}>
                    <img
                      src={url}
                      alt={`Gallery ${i}`}
                      className={styles.fitImage}
                    />
                    <div className={styles.overlay}>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGalleryImage(i);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyPlaceholder}>
                  Drag &amp; drop or click to add <strong>images</strong>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                ref={galleryInputRef}
                onChange={handleGalleryChange}
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Restaurant Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Location Picker */}
        <div className="mb-4">
          <label className="form-label">Location *</label>
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: '300px', borderRadius: '8px' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector />
            <Marker
              position={[location.lat, location.lng]}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => setLocation(e.target.getLatLng()),
              }}
            />
          </MapContainer>
          <div className="form-text">
            Click on the map or drag the marker to set your restaurant’s
            position.
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormValid || !isModified || loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </div>
  );
};

export default MyRestaurant;
