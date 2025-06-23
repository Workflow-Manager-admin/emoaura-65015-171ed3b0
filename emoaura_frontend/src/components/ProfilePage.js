import React from "react";
import ProfileForm from "./ProfileForm";
import ProfileCard from "./ProfileCard";

const PROFILE_KEY = "emoaura-profile-data";

// Try to load profile from storage
function getSavedProfile() {
  try {
    const data = window.localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

function clearProfile() {
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {}
}

// PUBLIC_INTERFACE
function ProfilePage() {
  const [profile, setProfile] = React.useState(getSavedProfile());
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    // Resync from storage after any reload
    setProfile(getSavedProfile());
  }, []);

  // onSubmit handler from ProfileForm (create or edit)
  const handleProfileSubmit = data => {
    setProfile(data);
    setEditing(false);
    saveProfile(data);
  };

  // Show profile display card if already created and not editing, else show ProfileForm
  return (
    <div style={{ padding: "2rem 0", minHeight: 500 }}>
      {!profile || editing ? (
        <ProfileForm
          onSubmit={handleProfileSubmit}
          initialData={profile}
        />
      ) : (
        <ProfileCard
          profile={profile}
          onEdit={() => setEditing(true)}
        />
      )}
      {/* Optionally allow reset/clear profile for demo/debug purposes */}
      {profile && (
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button
            onClick={() => {
              clearProfile();
              setProfile(null);
              setEditing(false);
            }}
            style={{
              background: "none",
              color: "#ce5b6d",
              border: "none",
              textDecoration: "underline",
              fontSize: "0.96rem",
              cursor: "pointer",
              marginTop: "6px",
            }}
            tabIndex={-1}
            type="button"
          >
            Clear Profile (demo)
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
