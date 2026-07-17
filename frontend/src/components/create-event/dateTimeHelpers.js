export const generateDateOptions = () => {
  const opts = [];
  const base = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    opts.push({
      label: d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
      value: d.toISOString().split("T")[0],
    });
  }
  return opts;
};

export const generateTimeOptions = () => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      opts.push({
        label: `${h12}:${String(m).padStart(2, "0")} ${ampm}`,
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      });
    }
  }
  return opts;
};

export const DATE_OPTS = generateDateOptions();
export const TIME_OPTS = generateTimeOptions();
