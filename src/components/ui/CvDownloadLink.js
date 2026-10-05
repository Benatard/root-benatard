import React from "react";
import { FiDownload } from "react-icons/fi";
import { resolveUploadUrl } from "../../config/config";
import { toast } from "../../service/swal";
import { useLang } from "../../i18n/LanguageContext";

export default function CvDownloadLink({ profile, className = "", label, ariaLabel }) {
  const { t } = useLang();

  if (!profile?.resumeUrl) return null;

  return (
    <a
      href={resolveUploadUrl(profile.resumeUrl)}
      download
      aria-label={ariaLabel || t("aside.downloadCvOf", { name: profile.name })}
      className={className}
      onClick={() => toast("success", t("cv.downloadStarted"))}
    >
      <FiDownload className="w-4 h-4" /> {label || t("aside.downloadCv")}
    </a>
  );
}