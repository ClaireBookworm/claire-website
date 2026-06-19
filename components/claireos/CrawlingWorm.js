// Small non-interactive worm that crawls along the bottom of the sub-pages.
// A recurring ClaireOS motif (README §B). Happy (orange) colors.

export default function CrawlingWorm({ duration = 22, bottom = 6 }) {
  const segs = [
    { size: 16, color: '#ff9f43', delay: 0 },
    { size: 14, color: '#ffb15c', delay: 0.1 },
    { size: 12, color: '#ff9f43', delay: 0.2 },
    { size: 10, color: '#ffb15c', delay: 0.3 },
  ];
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        animation: `ccCrawl ${duration}s linear infinite`,
      }}
    >
      {segs.map((s, i) => (
        <div
          key={i}
          style={{
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            border: '2px solid #0d1b2a',
            marginLeft: i === 0 ? 0 : -4,
            animation: `ccSeg .6s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
