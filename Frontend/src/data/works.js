// Add your real work here. For Google Drive, paste a share URL and set type to "drive".
// The helper below accepts either a Drive share URL or a file ID.

const driveId = (urlOrId) => {
  const str = String(urlOrId).trim();
  const match = str.match(/[-\w]{25,}/);
  return match ? match[0] : str;
};

const driveWork = (urlOrId, fields) => {
  const id = driveId(urlOrId);
  return {
    ...fields,
    type: "drive",
    fileId: id,
    embed: `https://drive.google.com/file/d/${id}/preview`,
    thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1920`,
    thumbnailFallback: `https://lh3.googleusercontent.com/d/${id}=w1920`,
  };
};

export const works = [
  driveWork(
    "https://drive.google.com/file/d/1jOfu_o1huiTD1xePqCNTlsjtEjSVLCxW/view?usp=drive_link",
    {
      id: "work-01",
      number: "01",
      title: "AI UGC PODCAST AD",
      category: "AI UGC / PERFORMANCE",
      description:
        "Created a highly realistic AI UGC podcast-style ad designed for performance marketing, delivered within a day.",
    },
  ),

  driveWork(
    "https://drive.google.com/file/d/1fBLcWLkrnrwS6Ge5nV1n4m4faIDjWsj3/view?usp=drive_link",
    {
      id: "work-02",
      number: "02",
      title: "NEPALI TRAVEL & TOURS",
      category: "AI VIDEO / TRAVEL",
      description:
        "Created an engaging Nepali travel and tours video using AI-generated visuals, designed to showcase destinations in a cinematic and compelling way.",
    },
  ),

  driveWork(
    "https://drive.google.com/file/d/1Sm85CzVjEfSdn_ZQAr01u7Hh0gIirt3_/view?usp=drive_link",
    {
      id: "work-03",
      number: "03",
      title: "NEPALI JEWELLERY AD",
      category: "AI VIDEO / ADVERTISING",
      description:
        "Created a premium Nepali jewellery advertisement using realistic AI visuals and product-focused storytelling.",
    },
  ),

  driveWork(
    "https://drive.google.com/file/d/11KWYHM2TmJXjpMX2qiGWn5qoc85C8zxd/view?usp=drive_link",
    {
      id: "work-04",
      number: "04",
      title: "INDIAN SUPPLEMENT BRAND",
      category: "AI UGC / PERFORMANCE",
      description:
        "Created a performance-focused AI UGC ad for an Indian supplement brand, which became one of their best-spending and best-performing ads.",
    },
  ),
];
