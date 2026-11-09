/* =========================================================
   PORTFOLIO CONFIGURATION
   ---------------------------------------------------------
   This is the main file to edit after your photo, CV and
   certificate are ready. Everything here is optional — the
   site falls back to clearly labelled placeholders.
   ========================================================= */

window.PORTFOLIO_CONFIG = {
  profile: {
    // Shown in the hero, navigation and footer.
    name: "Niel",

    /* Your photograph. If the file is missing or fails to load,
       the clearly labelled placeholder is shown instead. */
    photo: "assets/images/niel-swartz.jpeg",
    photoAlt: "Niel Swartz",
  },

  /* Add your real URLs and email address.
     Leave a value empty to keep the safe, non-clickable
     [PLACEHOLDER] state. Do not invent addresses. */
  social: {
    linkedin: "https://www.linkedin.com/in/niel-swartz-41314633a/",
    github: "https://github.com/NielMSwartz",
    whatsapp: "https://wa.me/27662017920", // +27 66 201 7920
    whatsappDisplay: "+27 66 201 7920",
    email: "nielswartz11@gmail.com",
  },

  /* -------------------------------------------------------
     DOCUMENTS
     -------------------------------------------------------
     1. Place the real PDFs in assets/documents/ using the
        filenames below.
     2. Change "available" to true for each document you add.
     3. The download buttons activate automatically.

     No placeholder or fabricated documents are included. */
  documents: {
    cv: {
      path: "assets/documents/cv.pdf",
      fileName: "Niel-CV.pdf",
      available: true,
    },
    samtrac: {
      path: "assets/documents/samtrac-certificate.pdf",
      fileName: "Niel-SAMTRAC-Certificate.pdf",
      available: true,
    },
  },
};
