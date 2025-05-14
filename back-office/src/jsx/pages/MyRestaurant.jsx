// src/components/MyRestaurant.jsx
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
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
const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Define tag options for react-select
const tagOptions = [
  { value: 'Serves alcohol', label: 'Serves alcohol' },
  { value: 'Valet parking available', label: 'Valet parking available' },
  { value: 'Smoking allowed', label: 'Smoking allowed' },
  { value: 'Outdoor seating', label: 'Outdoor seating' },
  { value: 'Brunch', label: 'Brunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Smart Casual', label: 'Smart Casual' },
  { value: 'Credit Cards', label: 'Credit Cards' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Wheelchair accessible', label: 'Wheelchair accessible' },
  { value: 'Family-friendly', label: 'Family-friendly' },
  { value: 'Vegan options', label: 'Vegan options' },
  { value: 'Gluten-free options', label: 'Gluten-free options' },
  { value: 'Takeout available', label: 'Takeout available' },
  { value: 'Live music', label: 'Live music' },
  { value: 'Pet-friendly', label: 'Pet-friendly' },
  { value: 'Wi-Fi available', label: 'Wi-Fi available' },
  { value: 'Reservations required', label: 'Reservations required' },
  { value: 'Happy hour', label: 'Happy hour' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Late-night dining', label: 'Late-night dining' },
  { value: 'Casual dining', label: 'Casual dining' },
  { value: 'Fine dining', label: 'Fine dining' },
  { value: 'Buffet', label: 'Buffet' },
  { value: 'Organic ingredients', label: 'Organic ingredients' },
  { value: 'Halal options', label: 'Halal options' },
  { value: 'Kosher options', label: 'Kosher options' },
  { value: 'Waterfront view', label: 'Waterfront view' },
];

// generate "HH:mm" slots every 15min
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};
const timeSlots = generateTimeSlots();

// format "HH:mm" → "7:00am"
const format12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const am = h < 12;
  const hrs = h % 12 || 12;
  return `${hrs}:${String(m).padStart(2, '0')}${am ? 'am' : 'pm'}`;
};
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
  const [workFrom, setWorkFrom] = useState('09:00'); // **new**
  const [workTo, setWorkTo] = useState('23:00'); // **new**
  const [isPublished, setIsPublished] = useState(false);
  // default to Tunis coordinates
  const [location, setLocation] = useState({ lat: 36.8065, lng: 10.1815 });
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([]);

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
          workFrom: data.workFrom || '07:00',
          workTo: data.workTo || '23:45',
          isPublished: data.isPublished,
          tags: data.tags || [],
        });
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
        });
        setWorkFrom(data.workFrom || '09:00');
        setWorkTo(data.workTo || '23:00');
        // Initialize selected tags as react-select format
        setSelectedTags(
          (data.tags || []).map((tag) => ({ value: tag, label: tag }))
        );
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

  // Handle tag selection with react-select
  const handleTagChange = (selected) => {
    setSelectedTags(selected || []);
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
          location.lng !== originalLocation.lng)) ||
      workFrom !== originalData.workFrom ||
      workTo !== originalData.workTo ||
      isPublished !== originalData.isPublished ||
      JSON.stringify(selectedTags.map((t) => t.value).sort()) !==
        JSON.stringify((originalData.tags || []).sort()));

  const pubToggled = originalData?.isPublished !== isPublished;
  const buttonText = pubToggled
    ? isPublished
      ? 'Publish'
      : 'Unpublish'
    : 'Update';
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
      payload.append('workFrom', workFrom);
      payload.append('workTo', workTo);
      payload.append('isPublished', isPublished);

      // Add tags to form data
      const tagValues = selectedTags.map((tag) => tag.value);
      payload.append('tags', JSON.stringify(tagValues));

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
        workFrom: data.workFrom,
        workTo: data.workTo,
        isPublished: data.isPublished,
        tags: data.tags || [],
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

        {/* ──────────────── NEW: Work Hours ──────────────── */}
        <div className="mb-4">
          <label className="form-label">Work Schedule (all week)</label>
          <div className="d-flex align-items-center gap-2">
            <span>From</span>
            <div className="form-group">
              <select
                value={workFrom}
                onChange={(e) => setWorkFrom(e.target.value)}
                className="form-control form-control-sm"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {format12(t)}
                  </option>
                ))}
              </select>
            </div>
            <span>To</span>

            <div className="form-group">
              <select
                value={workTo}
                onChange={(e) => setWorkTo(e.target.value)}
                className="form-control form-control-sm"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {format12(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Tags Selection with react-select */}
        <div className="mb-4">
          <label className="form-label">Tags</label>
          <Select
            isMulti
            value={selectedTags}
            onChange={handleTagChange}
            options={tagOptions}
            placeholder="Select tags..."
            styles={{
              control: (base) => ({
                ...base,
                lineHeight: '40px',
                color: '#7e7e7e',
                paddingLeft: '15px',
              }),
            }}
          />
          <div className="form-text">
            Select tags that describe your restaurant's features and services.
          </div>
        </div>

        {/* ─── PUBLICATION SWITCH ─── */}
        <div className={`form-check form-switch mb-3 ${styles.publishSwitch}`}>
          <input
            className="form-check-input"
            type="checkbox"
            id="publishedSwitch"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="publishedSwitch">
            Publish
          </label>
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${
            isModified && !loading ? styles.glowButton : ''
          }`}
          disabled={!isFormValid || !isModified || loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            buttonText
          )}
        </button>
      </form>
    </div>
  );
};

export default MyRestaurant;
