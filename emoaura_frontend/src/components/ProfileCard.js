import React from "react";
import styles from "./ProfilePage.module.css";

// PUBLIC_INTERFACE
function ProfileCard({ profile, onEdit }) {
  if (!profile) return null;
  return (
    <div className={styles.profileCard + " pastel-card"}>
      <div className={styles.cardTop}>
        <img
          src={profile.profilePic}
          alt={profile.fullName + " avatar"}
          className={styles.cardAvatar}
        />
        <div className={styles.cardTopInfo}>
          <div className={styles.cardNameRow}>
            <strong className={styles.cardName}>{profile.fullName}</strong>
            <span className={styles.cardUsername}>@{profile.username}</span>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>DOB:</span>
            <span className={styles.cardValue}>{profile.dob}</span>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>Gender:</span>
            <span className={styles.cardValue}>{profile.gender}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardBio}>{profile.bio}</p>
        <div className={styles.cardContact}>
          <span>
            <strong>Email:</strong> {profile.email}
          </span>
          <span>
            <strong>Mobile:</strong> {profile.mobile}
          </span>
        </div>
      </div>
      {onEdit && (
        <button className={styles.editBtn} onClick={onEdit}>
          Edit Profile
        </button>
      )}
    </div>
  );
}

export default ProfileCard;
