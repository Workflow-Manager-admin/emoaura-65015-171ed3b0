import React, { useRef, useState } from "react";
import styles from "./ProfilePage.module.css";

// Pastel soft default avatar options
const AVATAR_PRESETS = [
  "/default-avatars/pastel1.png",
  "/default-avatars/pastel2.png",
  "/default-avatars/pastel3.png",
  "/default-avatars/pastel4.png"
];

// Utility: validate fields
function validateProfile(data) {
  const errors = {};
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = "Full name required";
  }
  if (!/^[a-zA-Z0-9_\-.]{3,24}$/.test(data.username || "")) {
    errors.username = "Username must be 3-24 chars, no spaces";
  }
  if (
    !data.dob ||
    isNaN(Date.parse(data.dob)) ||
    new Date(data.dob) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13)
  ) {
    errors.dob = "Valid DOB (at least 13 years old) required";
  }
  if (
    !data.email ||
    !/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(data.email)
  ) {
    errors.email = "Valid email required";
  }
  if (
    !data.mobile ||
    !/^[0-9]{8,16}$/.test(data.mobile.replace(/[\s\-\(\)]/g, ""))
  ) {
    errors.mobile = "Valid mobile (digits only, 8-16)";
  }
  if (!data.gender) {
    errors.gender = "Select gender";
  }
  if (!data.bio || data.bio.trim().length < 4) {
    errors.bio = "Enter a brief bio";
  }
  if (!data.profilePic) {
    errors.profilePic = "Choose a profile picture or avatar";
  }
  return errors;
}

// PUBLIC_INTERFACE
function ProfileForm({ onSubmit, initialData }) {
  const [fields, setFields] = useState(
    initialData || {
      fullName: "",
      username: "",
      dob: "",
      email: "",
      mobile: "",
      gender: "",
      bio: "",
      profilePic: "",
    }
  );
  const [avatarSelection, setAvatarSel] = useState(""); // Use either preset or upload
  const [avatarPreview, setAvatarPreview] = useState(initialData?.profilePic || "");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fileInput = useRef();

  // Update field value
  const handleChange = e => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
  };

  // Avatar: set from presets
  const selectPresetAvatar = src => {
    setFields(f => ({ ...f, profilePic: src }));
    setAvatarPreview(src);
    setAvatarSel(src);
    setTouched(t => ({ ...t, profilePic: true }));
  };

  // Avatar: file upload
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = () => {
      setFields(f => ({ ...f, profilePic: reader.result }));
      setAvatarPreview(reader.result);
      setAvatarSel("");
      setTouched(t => ({ ...t, profilePic: true }));
    };
    reader.readAsDataURL(file);
  };

  // Validate/revalidate all fields
  React.useEffect(() => {
    setErrors(validateProfile(fields));
    // eslint-disable-next-line
  }, [fields, avatarSelection, avatarPreview]);

  // Form valid?
  const isValid = Object.keys(errors).length === 0;

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      fullName: true,
      username: true,
      dob: true,
      email: true,
      mobile: true,
      gender: true,
      bio: true,
      profilePic: true,
    });
    if (isValid) {
      onSubmit(fields);
    }
  }

  return (
    <form className={styles.profileForm + " pastel-form"} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Create Your Profile</h2>
      <div className={styles.avatarSection}>
        <label className={styles.avatarLabel}>
          Profile Picture
          <span className={styles.avatarRequired}>*</span>
        </label>
        <div className={styles.avatarUploadWrap}>
          <div className={styles.avatarPickList}>
            {AVATAR_PRESETS.map(src => (
              <button
                type="button"
                key={src}
                className={styles.presetAvatarBtn + (avatarSelection === src ? " " + styles.selected : "")}
                style={{ background: "none", border: "none", outline: "none" }}
                title="Choose preset avatar"
                onClick={() => selectPresetAvatar(src)}
              >
                <img src={src} alt="preset avatar" width={54} height={54} style={{borderRadius: 40, boxShadow: (avatarSelection === src ? "0 0 0 3px var(--kavia-orange)" : "0 0 0 1.5px #ffe5e5")}} />
              </button>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInput}
            onChange={handleFile}
            aria-label="Upload avatar"
          />
          <button className={styles.uploadAvatarBtn} type="button" onClick={() => fileInput.current.click()}>
            Upload Custom
          </button>
          {avatarPreview && (
            <div className={styles.avatarPreviewWrap}>
              <img src={avatarPreview} alt="Profile Preview" className={styles.avatarPreviewImg} />
            </div>
          )}
        </div>
        {touched.profilePic && errors.profilePic && (
          <div className={styles.error}>{errors.profilePic}</div>
        )}
      </div>
      <div className={styles.inputRow}>
        <div className={styles.inputCol}>
          <label>
            Full Name<span>*</span>
            <input
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              value={fields.fullName}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
              autoFocus
              autoComplete="off"
              className={styles.input}
            />
            {touched.fullName && errors.fullName && (
              <div className={styles.error}>{errors.fullName}</div>
            )}
          </label>
        </div>
        <div className={styles.inputCol}>
          <label>
            Username<span>*</span>
            <input
              type="text"
              name="username"
              maxLength={32}
              placeholder="jane_doe"
              value={fields.username}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, username: true }))}
              autoComplete="off"
              className={styles.input}
            />
            {touched.username && errors.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
          </label>
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.inputCol}>
          <label>
            Date of Birth<span>*</span>
            <input
              type="date"
              name="dob"
              value={fields.dob}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, dob: true }))}
              className={styles.input}
            />
            {touched.dob && errors.dob && (
              <div className={styles.error}>{errors.dob}</div>
            )}
          </label>
        </div>
        <div className={styles.inputCol}>
          <label>
            Gender<span>*</span>
            <select
              name="gender"
              value={fields.gender}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, gender: true }))}
              className={styles.input}
            >
              <option value="">Select gender...</option>
              <option>Female</option>
              <option>Male</option>
              <option>Nonbinary</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
            {touched.gender && errors.gender && (
              <div className={styles.error}>{errors.gender}</div>
            )}
          </label>
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.inputCol}>
          <label>
            Email<span>*</span>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={fields.email}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              className={styles.input}
            />
            {touched.email && errors.email && (
              <div className={styles.error}>{errors.email}</div>
            )}
          </label>
        </div>
        <div className={styles.inputCol}>
          <label>
            Mobile<span>*</span>
            <input
              type="tel"
              name="mobile"
              placeholder="1234567890"
              value={fields.mobile}
              onChange={handleChange}
              onBlur={() => setTouched(t => ({ ...t, mobile: true }))}
              className={styles.input}
            />
            {touched.mobile && errors.mobile && (
              <div className={styles.error}>{errors.mobile}</div>
            )}
          </label>
        </div>
      </div>
      <div className={styles.bioRow}>
        <label>
          Bio<span>*</span>
          <textarea
            name="bio"
            placeholder="What makes you, you?"
            maxLength={180}
            value={fields.bio}
            onChange={handleChange}
            onBlur={() => setTouched(t => ({ ...t, bio: true }))}
            rows={3}
            className={styles.input + " " + styles.bioInput}
          />
          {touched.bio && errors.bio && (
            <div className={styles.error}>{errors.bio}</div>
          )}
        </label>
      </div>
      <button
        className={styles.submitBtn}
        disabled={!isValid}
        type="submit"
        style={{
          opacity: isValid ? 1 : 0.5,
          pointerEvents: isValid ? "auto" : "none",
        }}
      >
        Save Profile
      </button>
    </form>
  );
}

export default ProfileForm;
