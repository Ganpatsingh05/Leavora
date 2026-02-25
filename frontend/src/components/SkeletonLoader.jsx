const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 space-y-4"
          >
            <div className="skeleton h-4 w-24 rounded-lg" />
            <div className="skeleton h-8 w-16 rounded-lg" />
            <div className="skeleton h-3 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3 p-6">
        <div className="skeleton h-10 w-full rounded-lg" />
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton h-6 w-full rounded-lg" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
