// Add your real work here. For Google Drive, paste a share URL and set type to "drive".
// The helper below accepts either a Drive share URL or a file ID.

const driveEmbed = (urlOrId) => {
  const str = String(urlOrId).trim();
  const match = str.match(/[-\w]{25,}/);
  const id = match ? match[0] : str;
  return `https://drive.google.com/file/d/${id}/preview?autoplay=1&mute=1`;
};

export const works = [
  {
    id: "work-01",
    number: "01",
    title: "INDIAN SUPPLEMENT BRAND / PROJECT 01",
    category: "AI UGC / PERFORMANCE",
    description:
      "Delivered a AI UGC ad within a day which client reported their one of the best performing ad.",
    type: "drive",
    embed: driveEmbed(
      "https://drive.google.com/file/d/1nOPbFKBG0Thqs8yMPC1rNb8-5vj1Ofu5/view?usp=drive_link",
    ),
  },
  {
    id: "work-02",
    number: "02",
    title: "INDIAN SUPPLEMENT BRAND / PROJECT 02",
    category: "AI UGC / PERFORMANCE",
    description:
      "Delivered a AI UGC ad within a day which client reported their one of the best SPENDING ad.",
    type: "drive",
    embed: driveEmbed(
      "https://drive.google.com/file/d/11KWYHM2TmJXjpMX2qiGWn5qoc85C8zxd/view?usp=drive_link",
    ),
  },
];
