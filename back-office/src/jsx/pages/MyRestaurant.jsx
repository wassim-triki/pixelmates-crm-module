import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { getRestaurantById } from '../../services/RestaurantService';
import { FaTrash } from 'react-icons/fa';
import styles from './MyRestaurant.module.css';
import axiosInstance from '../../config/axios';
import Preloader from '../components/Preloader';

const MyRestaurant = () => {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?._id;

  const [restaurant, setRestaurant] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

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

  // load initial data
  useEffect(() => {
    if (!restaurantId) return;
    (async () => {
      try {
        const res = await getRestaurantById(restaurantId);
        const data = res.data;
        setRestaurant(data);
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
      } catch (err) {
        console.error(err);
        setErrorMessage('Could not load restaurant data.');
      }
    })();
  }, [restaurantId]);

  // cleanup object URLs
  useEffect(
    () => () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    },
    [thumbnailPreview, galleryPreviews]
  );

  // common
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  // Thumbnail handlers
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setRemoveThumbnail(false);
    setRestaurant((r) => ({ ...r, thumbnail: '' }));
  };
  const handleThumbnailDrop = (e) => {
    preventDefaults(e);
    setThumbDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setRemoveThumbnail(false);
      setRestaurant((r) => ({ ...r, thumbnail: '' }));
    }
  };
  const handleRemoveThumbnail = (e) => {
    e.stopPropagation();
    setThumbnailFile(null);
    setThumbnailPreview('');
    setRemoveThumbnail(true);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = null;
    setRestaurant((r) => ({ ...r, thumbnail: '' }));
  };

  // Gallery handlers
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
      setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setRestaurant((r) => ({
        ...r,
        images: r.images.filter((_, i) => i !== idx),
      }));
    }
  };

  // validations
  const isFormValid = formData.name.trim() !== '';
  const isModified =
    originalData &&
    (formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.address !== originalData.address ||
      removeThumbnail ||
      !!thumbnailFile ||
      galleryFiles.length > 0 ||
      (restaurant.images || []).length !== (originalData.images || []).length);

  // submit
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

      // thumbnail delete flag
      if (removeThumbnail && !thumbnailFile) {
        payload.append('thumbnail', '');
      }
      // new thumbnail file
      if (thumbnailFile) {
        payload.append('thumbnail', thumbnailFile);
      }

      // gallery: either JSON array of URLs, or new files
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

      setSuccessMessage('Restaurant updated successfully!');
      // reset inputs
      setThumbnailFile(null);
      setThumbnailPreview('');
      setRemoveThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = null;

      setGalleryFiles([]);
      setGalleryPreviews([]);
      if (galleryInputRef.current) galleryInputRef.current.value = null;

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
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
