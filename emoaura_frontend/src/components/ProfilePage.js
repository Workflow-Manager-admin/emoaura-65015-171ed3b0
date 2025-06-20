import React, { useState, useRef } from "react";
import styles from "./ProfilePage.module.css";

// Dicebear avatar API for default options
const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const AVATAR_CHOICES = [
  "aurora", "nova", "moonlit", "echo", "vibe", "opal", "muse", "rift", "sage", "ray"
].map(seed => `${AVATAR_API}${seed}`);

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Other", label: "Other" },
];

// Validation helpers
function validateName(name) {
  if (!name.trim()) return "Name is required";
  if (!/^[A-Za-z '-]+$/.test(name)) return "Name contains invalid characters";
  if (name.length < 2) return "Name is too short";
  return "";
}
function validateUsername(username) {
  if (!username.trim()) return "Username is required";
  if (!/^[a-zA-Z0-9._]{3,24}$/.test(username))
    return "3-24 chars, letters, numbers, dot and underscore only";
  return "";
}
function validateDob(dob) {
  if (!dob) return "Date of birth is required";
  const d = new Date(dob);
  const today = new Date();
  if (d > today) return "Birthday cannot be in the future";
  const age = today.getFullYear() - d.getFullYear() -
    (today < new Date(dob + "T00:00:00").setFullYear(today.getFullYear()) ? 1 : 0);
  if (age < 10) return "Must be at least 10 years old";
  if (age > 110) return "Please enter a valid age";
  return "";
}
function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  // Simple regex for demonstration, not 100% bulletproof!
  if (!/^[-\w.+]+@([-\w]+\.)+[A-Za-z]{2,10}$/.test(email)) return "Invalid email address";
  return "";
}
function validatePhone(phone) {
  if (!phone.trim()) return "Phone is required";
  // Accepts only digits, spaces, dashes, (optionally +country code in start)
  if (!/^\+?[\d \-\(\)]{7,17}$/.test(phone))
    return "Invalid phone (include country code if outside US)";
  return "";
}
function validateGender(gender) {
  if (!gender) return "Please select your gender";
  return "";
}
function validateBio(bio) {
  if (!bio.trim()) return "A short bio is required";
  if (bio.length < 8) return "Bio is too short";
  if (bio.length > 200) return "Bio is too long";
  return "";
}
function validateProfilePic(profilePic, avatarChoice) {
  if (!profilePic && !avatarChoice) return "Select or upload a profile picture";
  return "";
}

function getInitialProfile() {
  let stored;
  try {
    stored = JSON.parse(window.localStorage.getItem("profilePageDemoData"));
  } catch {
    stored = null;
  }
  return (
    stored || {
      name: "",
      username: "",
      dob: "",
      email: "",
      phone: "",
      gender: "",
      bio: "",
      profilePic: "", // For uploaded file (data URL)
      avatarChoice: AVATAR_CHOICES[0],
    }
  );
}

function storeProfile(profile) {
  window.localStorage.setItem("profilePageDemoData", JSON.stringify(profile));
}

// PUBLIC_INTERFACE
export default function ProfilePage() {
  /**
   * Profile page with setup form and profile card view.
   * All fields required, validation, avatar/upload, CSS module pastel card.
   */
  const [editMode, setEditMode] = useState(() => {
    // Show form if no data in localStorage
    const stored = getInitialProfile();
    // If stored profile has all fields populated and valid, start in display mode
    return !stored || !stored.name || !stored.username || !stored.dob ? true : false;
  });
  const [profile, setProfile] = useState(getInitialProfile());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef();

  // Avatar or File
  const [avatarChoice, setAvatarChoice] = useState(profile.avatarChoice || AVATAR_CHOICES[0]);
  const [profilePic, setProfilePic] = useState(profile.profilePic || "");
  const [uploadUrl, setUploadUrl] = useState(profile.profilePic || "");
  const [uploadError, setUploadError] = useState("");

  // --- Field change handlers ---
  function handleFieldChange(e) {
    const { name, value } = e.target;
    setProfile((old) => ({ ...old, [name]: value }));
    setTouched((old) => ({ ...old, [name]: true }));
    // Debounce validation
    setErrors((errs) => ({ ...errs, [name]: "" }));
  }
  function handleAvatarPick(url) {
    setAvatarChoice(url);
    setProfile((old) => ({ ...old, avatarChoice: url, profilePic: "" }));
    setProfilePic("");
    setUploadUrl("");
    setUploadError("");
  }
  // Image upload handler
  function handleProfilePicUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setUploadError("Only image files allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size must be 2MB or less");
      return;
    }
    // Read file as data URL
    const reader = new window.FileReader();
    reader.onload = (event) => {
      const url = event.target.result;
      setProfilePic(url);
      setAvatarChoice("");
      setProfile((old) => ({ ...old, profilePic: url, avatarChoice: "" }));
      setUploadUrl(url);
      setUploadError("");
    };
    reader.readAsDataURL(file);
  }

  // --- Submission handling & validation ---
  function validateAll(profileObj = profile, pPic = profilePic, aChoice = avatarChoice) {
    const result = {
      name: validateName(profileObj.name),
      username: validateUsername(profileObj.username),
      dob: validateDob(profileObj.dob),
      email: validateEmail(profileObj.email),
      phone: validatePhone(profileObj.phone),
      gender: validateGender(profileObj.gender),
      bio: validateBio(profileObj.bio),
      profilePic: validateProfilePic(pPic, aChoice),
    };
    return result;
  }
  function isValid(errorsObj) {
    return Object.values(errorsObj).every((v) => !v);
  }
  function handleSubmit(e) {
    e.preventDefault();
    // Validate all
    const validateErrs = validateAll(profile, profilePic, avatarChoice);
    setErrors(validateErrs);
    setTouched({
      name: true, username: true, dob: true, email: true,
      phone: true, gender: true, bio: true, profilePic: true,
    });
    if (!isValid(validateErrs)) return;
    // Save
    const finalProfile = {
      ...profile,
      avatarChoice: avatarChoice || "",
      profilePic: profilePic || "",
    };
    setProfile(finalProfile);
    setEditMode(false);
    storeProfile(finalProfile);
  }
  function handleEdit() {
    setEditMode(true);
  }

  // --- Initial load: validate state for form display ---
  React.useEffect(() => {
    if (editMode && profile) {
      setErrors(validateAll(profile, profilePic, avatarChoice));
    }
    // eslint-disable-next-line
  }, [editMode]);

  // --- Renderers ---
  return (
    <div>
      {editMode ? (
        <form className={styles.profileCard} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.profileTitle}>Profile Setup</div>
          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={profile.name}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, name: true }))}
              autoComplete="off"
              required
            />
            {touched.name && errors.name && (
              <div className={styles.errorMsg}>{errors.name}</div>
            )}
          </div>
          {/* Username */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.input}
              value={profile.username}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, username: true }))}
              autoCapitalize="off"
              autoCorrect="off"
              required
            />
            {touched.username && errors.username && (
              <div className={styles.errorMsg}>{errors.username}</div>
            )}
          </div>
          {/* Date of Birth */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="dob">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              className={styles.input}
              value={profile.dob}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, dob: true }))}
              required
              max={new Date().toISOString().split("T")[0]}
            />
            {touched.dob && errors.dob && (
              <div className={styles.errorMsg}>{errors.dob}</div>
            )}
          </div>
          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={profile.email}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, email: true }))}
              autoComplete="off"
              required
            />
            {touched.email && errors.email && (
              <div className={styles.errorMsg}>{errors.email}</div>
            )}
          </div>
          {/* Phone */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={styles.input}
              value={profile.phone}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, phone: true }))}
              autoComplete="off"
              required
              placeholder="e.g. +1234567890"
            />
            {touched.phone && errors.phone && (
              <div className={styles.errorMsg}>{errors.phone}</div>
            )}
          </div>
          {/* Gender */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={styles.select}
              value={profile.gender}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, gender: true }))}
              required
            >
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {touched.gender && errors.gender && (
              <div className={styles.errorMsg}>{errors.gender}</div>
            )}
          </div>
          {/* Bio */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="bio">
              Bio (8-200 chars)
            </label>
            <textarea
              id="bio"
              name="bio"
              className={styles.textarea}
              value={profile.bio}
              onChange={handleFieldChange}
              onBlur={() => setTouched((old) => ({ ...old, bio: true }))}
              required
              maxLength={200}
            />
            {touched.bio && errors.bio && (
              <div className={styles.errorMsg}>{errors.bio}</div>
            )}
          </div>
          {/* Profile Picture: Pick avatar or upload */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Profile Picture</label>
            <div className={styles.avatarPickerContainer}>
              {/* Predefined Avatars */}
              <div>
                <div style={{ color: "#ae8bcc", fontWeight: 600, fontSize: "1.03rem", marginBottom: 4 }}>
                  Choose an Avatar:
                </div>
                <div className={styles.avatarPickerList}>
                  {AVATAR_CHOICES.map(url => (
                    <button
                      type="button"
                      key={url}
                      className={
                        styles.avatarOption +
                        (avatarChoice === url ? " " + styles.selected : "")
                      }
                      tabIndex={0}
                      aria-label="Pick Avatar"
                      onClick={() => handleAvatarPick(url)}
                      style={{
                        outline: "none",
                        borderColor: avatarChoice === url ? "#bc63c7" : undefined,
                      }}
                    >
                      <img src={url} alt="avatar option" />
                    </button>
                  ))}
                </div>
              </div>
              {/* Upload option */}
              <div>
                <div style={{ color: "#ae8bcc", fontWeight: 600, fontSize: "1.03rem", marginBottom: 4 }}>
                  Or Upload:
                </div>
                {profilePic ? (
                  <div className={styles.profilePicPreview}>
                    <img
                      src={profilePic}
                      className={styles.previewImg}
                      alt="Profile Pic Preview"
                    />
                    <button
                      type="button"
                      className={styles.changeAvatarBtn}
                      onClick={() => {
                        setProfilePic("");
                        setUploadUrl("");
                        setAvatarChoice("");
                        fileInputRef.current.value = "";
                      }}
                    >
                      Change Upload
                    </button>
                  </div>
                ) : (
                  <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.uploadAvatarInput}
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    aria-label="Upload Profile Picture"
                  />
                )}
                {uploadError && (
                  <div className={styles.errorMsg}>{uploadError}</div>
                )}
              </div>
            </div>
            {touched.profilePic && errors.profilePic && (
              <div className={styles.errorMsg}>{errors.profilePic}</div>
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={
              !isValid(validateAll(profile, profilePic, avatarChoice))
            }
          >
            Save Profile
          </button>
        </form>
      ) : (
        <ProfileDetailsView
          profile={profile}
          avatarChoice={profile.avatarChoice}
          profilePic={profile.profilePic}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

// Display mode: profile info card
function ProfileDetailsView({ profile, avatarChoice, profilePic, onEdit }) {
  // Display gender as-is, but hide label if empty
  return (
    <div className={styles.profileDetailsCard}>
      <button className={styles.editBtn} onClick={onEdit} aria-label="Edit Profile">
        Edit
      </button>
      <img
        className={styles.profileDetailsAvatar}
        src={profilePic || avatarChoice}
        alt="Profile avatar"
      />
      <div className={styles.profileDetailsName}>{profile.name}</div>
      <div className={styles.profileDetailsUsername}>@{profile.username}</div>
      <div className={styles.fieldGroupDetail}>
        <div className={styles.profileDetailsField}>
          <span className={styles.profileDetailsLabel}>Birthday:</span>
          <span>{profile.dob}</span>
        </div>
        <div className={styles.profileDetailsField}>
          <span className={styles.profileDetailsLabel}>Gender:</span>
          <span>{profile.gender}</span>
        </div>
      </div>
      <div className={styles.profileDetailsField}>
        <span className={styles.profileDetailsLabel}>Email:</span>
        <span>{profile.email}</span>
      </div>
      <div className={styles.profileDetailsField}>
        <span className={styles.profileDetailsLabel}>Phone:</span>
        <span>{profile.phone}</span>
      </div>
      <div className={styles.profileDetailsBio}>
        {profile.bio}
      </div>
    </div>
  );
}
